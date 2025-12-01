import type { FormField } from './pdf-form-service';
import { CoordinateConverter, type DisplayCoordinates, type PageDimensions } from './coordinate-converter';

export interface InlineFormField {
  field: FormField;
  displayCoordinates: DisplayCoordinates;
  isVisible: boolean;
  isFocused: boolean;
}

export class InlineFormManager {
  private formFields: Map<string, InlineFormField> = new Map();
  private pageDimensions: Map<number, PageDimensions> = new Map();
  private pdfPageDimensions: Map<number, PageDimensions> = new Map();
  private currentPage = 0;
  private displayScale = 1.5;

  /**
   * Set form fields for inline display
   */
  setFormFields(
    fields: FormField[],
    pageDimensions: Map<number, PageDimensions>,
    pdfPageDimensions?: Map<number, PageDimensions>,
    displayScale: number = 1.5
  ): void {
    this.displayScale = displayScale;
    this.pageDimensions = pageDimensions;
    this.pdfPageDimensions = pdfPageDimensions || new Map();
    this.formFields.clear();

    fields.forEach(field => {
      if (field.pageIndices && field.pageIndices.length > 0) {
        // Process each page where the field appears
        field.pageIndices.forEach(pageIndex => {
          const displayCoords = this.calculateDisplayCoordinates(field, pageIndex);
          if (displayCoords) {
            const inlineField: InlineFormField = {
              field,
              displayCoordinates: displayCoords,
              isVisible: pageIndex === this.currentPage,
              isFocused: false
            };

            // Use field name + page index as unique key for multi-page fields
            const key = `${field.name}_page_${pageIndex}`;
            this.formFields.set(key, inlineField);
          }
        });
      }
    });

    this.updateVisibility();
  }

  /**
   * Calculate display coordinates for a field on a specific page
   */
  private calculateDisplayCoordinates(
    field: FormField,
    pageIndex: number
  ): DisplayCoordinates | null {
    const pageDims = this.pageDimensions.get(pageIndex);
    if (!pageDims) {
      console.warn(`No dimensions available for page ${pageIndex}`);
      return null;
    }

    const pdfPageDims = this.pdfPageDimensions.get(pageIndex);

    const displayCoords = CoordinateConverter.pdfBoundsToDisplay(
      field,
      pageDims,
      pdfPageDims,
      this.displayScale
    );

    if (!displayCoords) {
      console.warn(`Failed to convert coordinates for field ${field.name} on page ${pageIndex}`);
      return null;
    }

    // Validate and sanitize coordinates
    if (!CoordinateConverter.validateDisplayCoordinates(displayCoords, pageDims)) {
      console.warn(`Invalid display coordinates for field ${field.name} on page ${pageIndex}`);
      return null;
    }

    return CoordinateConverter.sanitizeCoordinates(displayCoords, pageDims);
  }

  /**
   * Update visibility of fields based on current page
   */
  setCurrentPage(pageIndex: number): void {
    this.currentPage = pageIndex;
    this.updateVisibility();
  }

  /**
   * Update which fields are visible on the current page
   */
  private updateVisibility(): void {
    this.formFields.forEach((field, key) => {
      const [fieldName, pageNum] = key.split('_page_');
      const pageIndex = parseInt(pageNum);
      field.isVisible = pageIndex === this.currentPage;
    });
  }

  /**
   * Get all form fields (for debugging or state inspection)
   */
  getAllFields(): InlineFormField[] {
    return Array.from(this.formFields.values());
  }

  /**
   * Get visible form fields for the current page
   */
  getVisibleFields(): InlineFormField[] {
    return Array.from(this.formFields.values()).filter(field => field.isVisible);
  }

  /**
   * Get a specific field by name and page
   */
  getField(fieldName: string, pageIndex?: number): InlineFormField | undefined {
    if (pageIndex !== undefined) {
      return this.formFields.get(`${fieldName}_page_${pageIndex}`);
    }

    // Search across all pages
    for (const [key, field] of this.formFields.entries()) {
      if (key.startsWith(`${fieldName}_page_`) && field.isVisible) {
        return field;
      }
    }

    return undefined;
  }

  /**
   * Set focus state for a field
   */
  setFieldFocus(fieldName: string, pageIndex: number, focused: boolean): void {
    const field = this.formFields.get(`${fieldName}_page_${pageIndex}`);
    if (field) {
      field.isFocused = focused;
    }
  }

  /**
   * Update field value (not handled here - this is just for display state)
   */
  updateFieldValue(fieldName: string, pageIndex: number, value: any): void {
    const field = this.formFields.get(`${fieldName}_page_${pageIndex}`);
    if (field) {
      field.field.value = value;
    }
  }

  /**
   * Handle container resize by recalculating coordinates
   */
  handleResize(newPageDimensions: Map<number, PageDimensions>): void {
    const fields = Array.from(this.formFields.values()).map(inlineField => ({
      field: inlineField.field,
      currentPage: this.currentPage
    }));

    this.pageDimensions = newPageDimensions;
    this.formFields.clear();

    // Recalculate coordinates for all fields
    fields.forEach(({ field }) => {
      if (field.pageIndices && field.pageIndices.length > 0) {
        field.pageIndices.forEach(pageIndex => {
          const displayCoords = this.calculateDisplayCoordinates(field, pageIndex);
          if (displayCoords) {
            const inlineField: InlineFormField = {
              field,
              displayCoordinates: displayCoords,
              isVisible: pageIndex === this.currentPage,
              isFocused: false
            };

            const key = `${field.name}_page_${pageIndex}`;
            this.formFields.set(key, inlineField);
          }
        });
      }
    });

    this.updateVisibility();
  }

  /**
   * Clear all form fields
   */
  clear(): void {
    this.formFields.clear();
    this.pageDimensions.clear();
    this.pdfPageDimensions.clear();
    this.currentPage = 0;
  }

  /**
   * Get statistics about form fields
   */
  getStats(): {
    totalFields: number;
    visibleFields: number;
    currentPage: number;
    fieldsByPage: Record<number, number>;
  } {
    const fieldsByPage: Record<number, number> = {};

    this.formFields.forEach((field, key) => {
      const [, pageNum] = key.split('_page_');
      const pageIndex = parseInt(pageNum);
      fieldsByPage[pageIndex] = (fieldsByPage[pageIndex] || 0) + 1;
    });

    return {
      totalFields: this.formFields.size,
      visibleFields: this.getVisibleFields().length,
      currentPage: this.currentPage,
      fieldsByPage
    };
  }

  /**
   * Export current state for debugging
   */
  exportState(): any {
    return {
      formFields: Array.from(this.formFields.entries()).map(([key, field]) => ({
        key,
        field: {
          name: field.field.name,
          type: field.field.type,
          value: field.field.value,
          bounds: field.field.bounds,
          pageIndices: field.field.pageIndices
        },
        displayCoordinates: field.displayCoordinates,
        isVisible: field.isVisible,
        isFocused: field.isFocused
      })),
      currentPage: this.currentPage,
      stats: this.getStats()
    };
  }
}