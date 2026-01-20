/**
 * Chat Text Formatting Utilities
 * 
 * Ensures consistent formatting in chat responses:
 * - Proper paragraph spacing
 * - No concatenated words
 * - Clean markdown output
 */

/**
 * Join text blocks with proper paragraph spacing.
 * 
 * - Filters out empty/whitespace-only blocks
 * - Trims each block
 * - Joins with double newline (markdown paragraphs)
 * 
 * @param blocks - Array of text sections
 * @returns Formatted text with proper paragraphs
 */
export function joinBlocks(blocks: string[]): string {
    return blocks
        .filter(block => block && block.trim().length > 0)
        .map(block => block.trim())
        .join('\n\n');
}

/**
 * Normalize spacing in text.
 * 
 * - Converts Windows line endings to Unix
 * - Removes excessive blank lines (max 2 newlines)
 * - Normalizes multiple spaces to single space
 * - Ensures space after punctuation followed by letter
 * 
 * @param text - Raw text to normalize
 * @returns Text with normalized spacing
 */
export function normalizeSpacing(text: string): string {
    return text
        // Windows -> Unix line endings
        .replace(/\r\n/g, '\n')
        // Max 2 newlines (one blank line)
        .replace(/\n{3,}/g, '\n\n')
        // Multiple spaces -> single space (but not at line start)
        .replace(/([^\n]) +/g, '$1 ')
        // Ensure space after period/comma/colon followed by letter
        .replace(/([.,:;!?])([A-Za-zÀ-ÿ])/g, '$1 $2')
        .trim();
}

/**
 * Format markdown sections for chat output.
 * 
 * Combines joinBlocks + normalizeSpacing for clean output.
 * 
 * @param sections - Array of markdown sections
 * @returns Clean formatted markdown
 */
export function formatChatOutput(sections: string[]): string {
    const joined = joinBlocks(sections);
    return normalizeSpacing(joined);
}

/**
 * Ensure list items start on new lines.
 * Handles cases where lists are accidentally concatenated.
 * 
 * @param text - Text that may contain lists
 * @returns Text with properly formatted lists
 */
export function fixListFormatting(text: string): string {
    return text
        // Ensure bullet lists have newline before
        .replace(/([^\n])((?:\n)?(?:[-•] ))/g, '$1\n$2')
        // Ensure numbered lists have newline before
        .replace(/([^\n])((?:\n)?(?:\d+\. ))/g, '$1\n$2');
}
