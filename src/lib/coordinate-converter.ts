import type { FormField } from './pdf-form-service';

export interface DisplayCoordinates {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PageDimensions {
  width: number;
  height: number;
}

/**
 * Handles coordinate conversion between PDF coordinate system and web display coordinate system
 *
 * PDF Coordinate System:
 * - Origin: bottom-left corner
 * - Units: points (1/72 inch)
 * - Y increases upward
 *
 * Web Display Coordinate System:
 * - Origin: top-left corner
 * - Units: pixels
 * - Y increases downward
 */
export class CoordinateConverter {
  /**
   * Convert PDF field bounds to display coordinates for overlay positioning
   *
   * @param field - Form field with PDF bounds
   * @param pageDimensions - Rendered page dimensions in pixels
   * @param pdfPageDimensions - Original PDF page dimensions in points
   * @param displayScale - Scale factor used in PDF.js rendering (default 1.5)
   * @returns Display coordinates in pixels
   */
  static pdfBoundsToDisplay(
    field: FormField,
    pageDimensions: PageDimensions,
    pdfPageDimensions?: PageDimensions,
    displayScale: number = 1.5
  ): DisplayCoordinates | null {
    if (!field.bounds || !field.pageIndices || field.pageIndices.length === 0) {
      return null;
    }

    const pdfBounds = field.bounds;

    // If we have PDF page dimensions, use them for accurate conversion
    if (pdfPageDimensions) {
      return this.convertWithPdfDimensions(
        pdfBounds,
        pageDimensions,
        pdfPageDimensions,
        displayScale
      );
    }

    // Fallback: assume PDF bounds are already in the same scale as display
    return this.convertDirectScaling(pdfBounds, pageDimensions, displayScale);
  }

  /**
   * Convert using PDF page dimensions for accurate positioning
   */
  private static convertWithPdfDimensions(
    pdfBounds: { x: number; y: number; width: number; height: number },
    displayDimensions: PageDimensions,
    pdfDimensions: PageDimensions,
    displayScale: number
  ): DisplayCoordinates {
    // Scale PDF bounds by display scale (PDF.js rendering scale)
    const scaledBounds = {
      x: pdfBounds.x * displayScale,
      y: pdfBounds.y * displayScale,
      width: pdfBounds.width * displayScale,
      height: pdfBounds.height * displayScale
    };

    // Convert from PDF coordinates (bottom-left origin) to web coordinates (top-left origin)
    const displayY = displayDimensions.height - scaledBounds.y - scaledBounds.height;

    return {
      x: scaledBounds.x,
      y: displayY,
      width: scaledBounds.width,
      height: scaledBounds.height
    };
  }

  /**
   * Direct scaling conversion when PDF page dimensions aren't available
   */
  private static convertDirectScaling(
    pdfBounds: { x: number; y: number; width: number; height: number },
    displayDimensions: PageDimensions,
    displayScale: number
  ): DisplayCoordinates {
    // Scale bounds by display scale
    const scaledBounds = {
      x: pdfBounds.x * displayScale,
      y: pdfBounds.y * displayScale,
      width: pdfBounds.width * displayScale,
      height: pdfBounds.height * displayScale
    };

    // Convert Y coordinate (PDF from bottom, web from top)
    const displayY = displayDimensions.height - scaledBounds.y - scaledBounds.height;

    return {
      x: scaledBounds.x,
      y: displayY,
      width: scaledBounds.width,
      height: scaledBounds.height
    };
  }

  /**
   * Convert display coordinates back to percentage for responsive positioning
   */
  static displayToPercentages(
    coords: DisplayCoordinates,
    containerDimensions: PageDimensions
  ): { xPercent: number; yPercent: number; widthPercent: number; heightPercent: number } {
    return {
      xPercent: (coords.x / containerDimensions.width) * 100,
      yPercent: (coords.y / containerDimensions.height) * 100,
      widthPercent: (coords.width / containerDimensions.width) * 100,
      heightPercent: (coords.height / containerDimensions.height) * 100
    };
  }

  /**
   * Get the current page's PDF dimensions using PDF.js page info
   * This should be called during PDF loading to get accurate dimensions
   */
  static async getPdfPageDimensions(pdfJsPage: any): Promise<PageDimensions> {
    try {
      const viewport = pdfJsPage.getViewport({ scale: 1.0 }); // Get natural size
      return {
        width: viewport.width,
        height: viewport.height
      };
    } catch (error) {
      console.warn('Failed to get PDF page dimensions:', error);
      // Return fallback dimensions
      return { width: 612, height: 792 }; // Standard US Letter size in points
    }
  }

  /**
   * Validate if display coordinates are within reasonable bounds
   */
  static validateDisplayCoordinates(
    coords: DisplayCoordinates,
    containerDimensions: PageDimensions
  ): boolean {
    return (
      coords.x >= 0 &&
      coords.y >= 0 &&
      coords.width > 0 &&
      coords.height > 0 &&
      coords.x + coords.width <= containerDimensions.width &&
      coords.y + coords.height <= containerDimensions.height
    );
  }

  /**
   * Sanitize coordinates to ensure they stay within container bounds
   */
  static sanitizeCoordinates(
    coords: DisplayCoordinates,
    containerDimensions: PageDimensions
  ): DisplayCoordinates {
    return {
      x: Math.max(0, Math.min(coords.x, containerDimensions.width - 10)),
      y: Math.max(0, Math.min(coords.y, containerDimensions.height - 10)),
      width: Math.max(10, Math.min(coords.width, containerDimensions.width - coords.x)),
      height: Math.max(10, Math.min(coords.height, containerDimensions.height - coords.y))
    };
  }
}