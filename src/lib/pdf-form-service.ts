import { PDFDocument, type PDFForm, type PDFField } from 'pdf-lib';

export type FieldType = 'text' | 'checkbox' | 'radio' | 'dropdown' | 'list' | 'signature';

export interface FormField {
  name: string;
  type: FieldType;
  value: any;
  required: boolean;
  options?: string[];
  bounds?: { x: number; y: number; width: number; height: number };
  pageIndices?: number[]; // Pages where this field appears
  maxLength?: number;
  readOnly: boolean;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export class PDFFormService {
  private pdfDoc: PDFDocument | null = null;
  private form: PDFForm | null = null;

  async loadDocument(arrayBuffer: ArrayBuffer): Promise<void> {
    this.pdfDoc = await PDFDocument.load(arrayBuffer);
    this.form = this.pdfDoc.getForm();
  }

  detectFormFields(): FormField[] {
    if (!this.form) {
      return [];
    }

    try {
      const fields = this.form.getFields();
      return fields.map(field => this.mapFieldToFormField(field));
    } catch (error) {
      console.warn('Failed to detect form fields:', error);
      return [];
    }
  }

  async fillForm(formData: Record<string, any>): Promise<void> {
    if (!this.form) {
      throw new Error('PDF form not loaded');
    }

    Object.entries(formData).forEach(([fieldName, value]) => {
      try {
        const field = this.form!.getField(fieldName);
        this.setFieldValue(field, value);
      } catch (error) {
        console.warn(`Field ${fieldName} not found or invalid value:`, error);
      }
    });
  }

  async saveDocument(): Promise<Uint8Array> {
    if (!this.pdfDoc) {
      throw new Error('PDF document not loaded');
    }
    return await this.pdfDoc.save();
  }

  flattenForm(): void {
    if (!this.form) {
      throw new Error('PDF form not loaded');
    }
    this.form.flatten();
  }

  validateField(field: FormField, value: any): ValidationResult {
    if (field.required && (!value || value === '')) {
      return { valid: false, error: `${field.name} is required` };
    }

    if (field.type === 'text' && field.maxLength && value && value.length > field.maxLength) {
      return { 
        valid: false, 
        error: `${field.name} exceeds maximum length of ${field.maxLength}` 
      };
    }

    if ((field.type === 'dropdown' || field.type === 'radio') && 
        value && 
        field.options && 
        !field.options.includes(value)) {
      return { valid: false, error: `${field.name} has invalid option` };
    }

    if (field.type === 'list' && 
        Array.isArray(value) && 
        field.options && 
        !value.every(opt => field.options!.includes(opt))) {
      return { valid: false, error: `${field.name} has invalid options` };
    }

    return { valid: true };
  }

  private mapFieldToFormField(field: PDFField): FormField {
    const fieldType = field.constructor.name;
    const name = field.getName();
    
    return {
      name,
      type: this.getFieldType(fieldType),
      value: this.getCurrentFieldValue(field),
      required: field.isRequired(),
      options: this.getFieldOptions(field),
      bounds: this.getFieldBounds(field),
      pageIndices: this.getFieldPageIndices(field),
      maxLength: this.getMaxLength(field),
      readOnly: this.isReadOnly(field)
    };
  }

  private getFieldType(pdfFieldType: string): FieldType {
    switch (pdfFieldType) {
      case 'PDFTextField': return 'text';
      case 'PDFCheckBox': return 'checkbox';
      case 'PDFRadioGroup': return 'radio';
      case 'PDFDropdown': return 'dropdown';
      case 'PDFOptionList': return 'list';
      case 'PDFSignature': return 'signature';
      default: return 'text';
    }
  }

  private getCurrentFieldValue(field: PDFField): any {
    try {
      // Type-safe field value extraction
      const fieldName = field.getName();
      if (!fieldName) return null;

      switch (field.constructor.name) {
        case 'PDFTextField': {
          const textField = field as any;
          return typeof textField.getText === 'function' ? textField.getText() || '' : '';
        }
        case 'PDFCheckBox': {
          const checkBox = field as any;
          return typeof checkBox.isChecked === 'function' ? checkBox.isChecked() : false;
        }
        case 'PDFRadioGroup': {
          const radioGroup = field as any;
          return typeof radioGroup.getSelected === 'function' ? radioGroup.getSelected() || '' : '';
        }
        case 'PDFDropdown': {
          const dropdown = field as any;
          return typeof dropdown.getSelected === 'function' ? dropdown.getSelected() || '' : '';
        }
        case 'PDFOptionList': {
          const optionList = field as any;
          return typeof optionList.getSelected === 'function' ? optionList.getSelected() || [] : [];
        }
        case 'PDFSignature': 
          return null;
        default: 
          return null;
      }
    } catch (error) {
      console.warn(`Failed to get current value for field ${field.getName()}:`, error);
      return null;
    }
  }

  private getFieldOptions(field: PDFField): string[] | undefined {
    try {
      const fieldType = field.constructor.name;
      if (!['PDFDropdown', 'PDFOptionList', 'PDFRadioGroup'].includes(fieldType)) {
        return undefined;
      }

      const fieldObj = field as any;
      if (typeof fieldObj.getOptions === 'function') {
        const options = fieldObj.getOptions();
        return Array.isArray(options) ? options : undefined;
      }
    } catch (error) {
      console.warn(`Failed to get options for field ${field.getName()}:`, error);
      return undefined;
    }
    return undefined;
  }

  private getFieldBounds(field: PDFField): { x: number; y: number; width: number; height: number } | undefined {
    try {
      const widgets = (field as any).acroField.getWidgets();
      if (widgets.length > 0) {
        const rect = widgets[0].getRect();
        return { 
          x: rect.x, 
          y: rect.y, 
          width: rect.width, 
          height: rect.height 
        };
      }
    } catch {
      return undefined;
    }
    return undefined;
  }

  private getFieldPageIndices(field: PDFField): number[] | undefined {
    try {
      const widgets = (field as any).acroField.getWidgets();
      const pageIndices: number[] = [];
      
      for (const widget of widgets) {
        const pageRef = widget.getPage();
        if (pageRef && this.pdfDoc) {
          // Find the page index by comparing page references
          const pages = this.pdfDoc.getPages();
          const pageIndex = pages.findIndex(page => {
            const pageDict = page.ref;
            return pageDict && pageDict.toString() === pageRef.toString();
          });
          
          if (pageIndex !== -1 && !pageIndices.includes(pageIndex)) {
            pageIndices.push(pageIndex);
          }
        }
      }
      
      return pageIndices.length > 0 ? pageIndices : undefined;
    } catch {
      return undefined;
    }
  }

  private getMaxLength(field: PDFField): number | undefined {
    try {
      if (field.constructor.name !== 'PDFTextField') {
        return undefined;
      }

      const textField = field as any;
      if (typeof textField.getMaxLen === 'function') {
        const maxLength = textField.getMaxLen();
        return typeof maxLength === 'number' && maxLength > 0 ? maxLength : undefined;
      }
    } catch (error) {
      console.warn(`Failed to get max length for field ${field.getName()}:`, error);
      return undefined;
    }
    return undefined;
  }

  private isReadOnly(field: PDFField): boolean {
    try {
      const fieldObj = field as any;
      if (typeof fieldObj.isReadOnly === 'function') {
        return fieldObj.isReadOnly();
      }
    } catch (error) {
      console.warn(`Failed to check read-only status for field ${field.getName()}:`, error);
    }
    return false;
  }

  private setFieldValue(field: PDFField, value: any): void {
    try {
      const fieldName = field.getName();
      if (!fieldName) return;

      switch (field.constructor.name) {
        case 'PDFTextField': {
          const textField = field as any;
          if (typeof textField.setText === 'function') {
            textField.setText(value?.toString() || '');
          }
          break;
        }
        case 'PDFCheckBox': {
          const checkBox = field as any;
          if (typeof checkBox.check === 'function' && typeof checkBox.uncheck === 'function') {
            value ? checkBox.check() : checkBox.uncheck();
          }
          break;
        }
        case 'PDFRadioGroup': {
          const radioGroup = field as any;
          if (typeof radioGroup.select === 'function' && typeof radioGroup.getOptions === 'function') {
            const options = radioGroup.getOptions();
            if (value && Array.isArray(options) && options.includes(value)) {
              radioGroup.select(value);
            }
          }
          break;
        }
        case 'PDFDropdown': {
          const dropdown = field as any;
          if (typeof dropdown.select === 'function' && typeof dropdown.getOptions === 'function') {
            const options = dropdown.getOptions();
            if (value && Array.isArray(options) && options.includes(value)) {
              dropdown.select(value);
            }
          }
          break;
        }
        case 'PDFOptionList': {
          const optionList = field as any;
          if (typeof optionList.select === 'function' && typeof optionList.getOptions === 'function') {
            const options = optionList.getOptions();
            if (Array.isArray(value)) {
              const validOptions = value.filter(opt => Array.isArray(options) && options.includes(opt));
              optionList.select(validOptions);
            } else if (value && Array.isArray(options) && options.includes(value)) {
              optionList.select([value]);
            }
          }
          break;
        }
      }
    } catch (error) {
      console.warn(`Failed to set field value for ${field.getName()}:`, error);
    }
  }
}