import { htmlToText } from "html-to-text";

export const auditLogsTruncateTexts = (text, length = 25) => {
  const plainText = htmlToText(text, {
    wordwrap: false, // Prevent automatic line wrapping
  });

  if (plainText.length <= length) return plainText;

  return plainText.substring(0, length) + ".....";
};

// trucncating the text to display the 300 text on the Notes item card
export const truncateText = (text) => {
  if (text.length < 300) return text;

  return text.substring(0, 300) + ".....";
};
