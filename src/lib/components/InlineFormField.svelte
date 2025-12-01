<script lang="ts">
  import type { FormField } from '$lib/pdf-form-service';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  /**
   * Props for inline form field component
   */
  let {
    field,
    value,
    disabled = false,
    onChange,
    onFocus,
    onBlur
  } = $props<{
    /** Form field definition */
    field: FormField;
    /** Current value of the field */
    value: any;
    /** Whether the field is disabled */
    disabled?: boolean;
    /** Callback when field value changes */
    onChange: (value: any) => void;
    /** Callback when field is focused */
    onFocus?: () => void;
    /** Callback when field is blurred */
    onBlur?: () => void;
  }>();

  /**
   * Generate input ID from field name
   */
  const inputId = `inline-field-${field.name.replace(/[^a-zA-Z0-9]/g, '-')}`;

  /**
   * Handle input change based on field type
   */
  function handleChange(event: Event): void {
    const target = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

    switch (field.type) {
      case 'checkbox':
        const checkboxTarget = target as HTMLInputElement;
        onChange(checkboxTarget.checked);
        break;
      case 'list':
        const selectTarget = target as HTMLSelectElement;
        const selectedOptions = Array.from(selectTarget.selectedOptions).map(option => option.value);
        onChange(selectedOptions);
        break;
      default:
        onChange(target.value);
    }
  }

  /**
   * Get CSS classes for the field input
   */
  function getInputClasses(): string {
    const baseClasses = 'w-full h-full border border-transparent hover:border-blue-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-300 focus:ring-opacity-50 outline-none transition-all duration-200 backdrop-blur-sm';

    if (disabled) {
      return `${baseClasses} bg-gray-100 bg-opacity-80 cursor-not-allowed opacity-60`;
    }

    if (field.readOnly) {
      return `${baseClasses} bg-gray-50 bg-opacity-60 cursor-default`;
    }

    return `${baseClasses} bg-white bg-opacity-95 hover:bg-opacity-100`;
  }

  /**
   * Get input styles for positioning and sizing
   */
  function getInputStyles(): string {
    // Adjust font size based on field size
    const minDimension = Math.min(
      100, // fallback minimum
      field.bounds?.width || 100,
      field.bounds?.height || 20
    );

    let fontSize = '12px';
    if (minDimension > 30) fontSize = '14px';
    if (minDimension > 50) fontSize = '16px';

    return `font-size: ${fontSize}; padding: 3px 6px; line-height: 1.3; font-family: inherit;`;
  }
</script>

{#if field.type === 'text'}
  <input
    id={inputId}
    type="text"
    class={getInputClasses()}
    style={getInputStyles()}
    value={value || ''}
    placeholder={field.required ? 'Required' : ''}
    maxlength={field.maxLength}
    disabled={disabled || field.readOnly}
    oninput={handleChange}
    onfocus={onFocus}
    onblur={onBlur}
  />

{:else if field.type === 'checkbox'}
  <div class="w-full h-full flex items-center justify-center">
    <input
      id={inputId}
      type="checkbox"
      class="w-4 h-4 border-2 border-gray-400 rounded cursor-pointer transition-all duration-200 hover:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
      checked={value || false}
      disabled={disabled || field.readOnly}
      onchange={handleChange}
      onfocus={onFocus}
      onblur={onBlur}
    />
  </div>

{:else if field.type === 'radio'}
  <div class="w-full h-full flex items-center flex-wrap gap-2">
    {#each field.options || [] as option}
      <label class="flex items-center">
        <input
          id={`${inputId}-${option}`}
          type="radio"
          name={field.name}
          class="w-3 h-3 mr-1 border-2 border-gray-400 cursor-pointer transition-all duration-200 hover:border-blue-500 focus:ring-1 focus:ring-blue-300 focus:ring-opacity-50"
          checked={value === option}
          disabled={disabled || field.readOnly}
          value={option}
          onchange={handleChange}
          onfocus={onFocus}
          onblur={onBlur}
        />
        <span class="text-xs">{option}</span>
      </label>
    {/each}
  </div>

{:else if field.type === 'dropdown'}
  <select
    id={inputId}
    class={getInputClasses()}
    style={getInputStyles()}
    value={value || ''}
    disabled={disabled || field.readOnly}
    onchange={handleChange}
    onfocus={onFocus}
    onblur={onBlur}
  >
    <option value="" class="text-gray-500">-- Select --</option>
    {#each field.options || [] as option}
      <option value={option}>{option}</option>
    {/each}
  </select>

{:else if field.type === 'list'}
  <select
    id={inputId}
    class={getInputClasses()}
    style={getInputStyles()}
    multiple
    value={value || []}
    disabled={disabled || field.readOnly}
    onchange={handleChange}
    onfocus={onFocus}
    onblur={onBlur}
  >
    {#each field.options || [] as option}
      <option value={option}>{option}</option>
    {/each}
  </select>

{:else if field.type === 'signature'}
  <div class="w-full h-full border-2 border-dashed border-gray-400 rounded flex items-center justify-center bg-gray-50 bg-opacity-80">
    <button
      type="button"
      class="text-xs text-gray-600 hover:text-blue-600 px-2 py-1"
      disabled={disabled}
      onclick={() => {
        // This will be handled by the parent component
        dispatch('request-signature', { fieldName: field.name });
      }}
    >
      {value ? 'Replace Signature' : 'Add Signature'}
    </button>
  </div>

{:else}
  <!-- Unknown field type - show a text input as fallback -->
  <input
    id={inputId}
    type="text"
    class={getInputClasses()}
    style={getInputStyles()}
    value={value || ''}
    disabled={disabled}
    oninput={handleChange}
    onfocus={onFocus}
    onblur={onBlur}
  />
{/if}