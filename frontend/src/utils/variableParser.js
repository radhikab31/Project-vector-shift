export const extractVariables = (text) => {
  if (!text || typeof text !== "string") {
    return [];
  }

  const regex = /\{\{(\w+)\}\}/g;
  const variables = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    const variableName = match[1]; 
    if (!variables.includes(variableName)) {
      variables.push(variableName);
    }
  }

  return variables;
};

export const calculateLineCount = (text, charWidth = 8) => {
  if (!text) return 1;

  const estimatedCharsPerLine = Math.max(1, Math.floor(120 / charWidth));
  
  const newlines = (text.match(/\n/g) || []).length;
  const textWithoutNewlines = text.replace(/\n/g, "");
  const estimatedWraps = Math.ceil(textWithoutNewlines.length / estimatedCharsPerLine);

  return newlines + estimatedWraps + 1;
};