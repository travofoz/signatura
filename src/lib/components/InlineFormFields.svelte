<script lang="ts">
  import InlineFormField from './InlineFormField.svelte';
  import type { InlineFormField as InlineFormFieldData } from '$lib/inline-form-manager';

  /**
   * Props for the inline form fields overlay component
   */
  let {
    fields,
    formData,
    containerElement,
    onFieldChange,
    onFieldFocus,
    onFieldBlur,
    onSignatureRequest
  } = $props<{
    /** Array of inline form fields for current page */
    fields: InlineFormFieldData[];
    /** Current form data values */
    formData: Record<string, any>;
    /** PDF container element for coordinate calculations */
    containerElement: HTMLDivElement | undefined;
    /** Callback when a field value changes */
    onFieldChange: (fieldName: string, value: any) => void;
    /** Callback when a field gets focus */
    onFieldFocus?: (fieldName: string) => void;
    /** Callback when a field loses focus */
    onFieldBlur?: (fieldName: string) => void;
    /** Callback when signature is requested */
    onSignatureRequest?: (fieldName: string) => void;
  }>();

  /**
   * Handle field value change
   */
  function handleFieldChange(fieldName: string, value: any): void {
    onFieldChange(fieldName, value);
  }

  /**
   * Handle field focus
   */
  function handleFieldFocus(fieldName: string): void {
    onFieldFocus?.(fieldName);
  }

  /**
   * Handle field blur
   */
  function handleFieldBlur(fieldName: string): void {
    onFieldBlur?.(fieldName);
  }

  /**
   * Handle signature request
   */
  function handleSignatureRequest(fieldName: string): void {
    onSignatureRequest?.(fieldName);
  }

  /**
   * Get container-relative position and size for a field
   */
  function getFieldStyle(field: InlineFormFieldData): string {
    if (!containerElement) {
      return '';
    }

    const coords = field.displayCoordinates;
    return `left: ${coords.x}px; top: ${coords.y}px; width: ${coords.width}px; height: ${coords.height}px;`;
  }

  /**
   * Check if a field should be visible
   */
  function isFieldVisible(field: InlineFormFieldData): boolean {
    return field.isVisible && containerElement !== undefined;
  }

  /**
   * Get field value from form data
   */
  function getFieldValue(fieldName: string): any {
    return formData[fieldName];
  }
</script>

{#if containerElement}
  <div class="absolute inset-0 pointer-events-none" style="z-index: 10;">
    {#each fields.filter(isFieldVisible) as inlineField (inlineField.field.name)}
      <div
        class="absolute pointer-events-auto"
        style={getFieldStyle(inlineField)}
        data-field-name={inlineField.field.name}
        data-field-type={inlineField.field.type}
      >
        <InlineFormField
          field={inlineField.field}
          value={getFieldValue(inlineField.field.name)}
          disabled={false}
          onChange={(value) => handleFieldChange(inlineField.field.name, value)}
          onFocus={() => handleFieldFocus(inlineField.field.name)}
          onBlur={() => handleFieldBlur(inlineField.field.name)}
        />

        <!-- Field indicator for debugging (optional) -->
        {#if inlineField.isFocused}
          <div
            class="absolute inset-0 border-2 border-blue-500 rounded pointer-events-none"
            style="z-index: 1;"
          ></div>
        {/if}
      </div>
    {/each}
  </div>
{/if}