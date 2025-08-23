import DOMPurify from "dompurify";

// Quill のデフォルトクラスを許可
const allowedClasses = ["ql-size-small", "ql-size-large", "ql-size-huge"];

// フックで class と style をフィルタリング
DOMPurify.addHook("uponSanitizeAttribute", (_, data) => {
  if (data.attrName === "class") {
    const classes = data.attrValue.split(" ");
    const filtered = classes.filter(c => allowedClasses.includes(c));
    data.attrValue = filtered.join(" ");
  }

  if (data.attrName === "style") {
    const allowedStyles = ["color"];
    const styles = data.attrValue
      .split(";")
      .map(s => s.trim())
      .filter(s => allowedStyles.some(prop => s.startsWith(prop)));
    data.attrValue = styles.join("; ");
  }
});

export const sanitizeText = (text: string): string => {
  const sanitizedText = DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [
      "b", "strong", "i", "u", "span", "p",
      "ul", "ol", "li", "br"
    ],
    // class と style の両方を許可
    ALLOWED_ATTR: ["class", "style"],
  });
  return sanitizedText ?? "";
};

export const htmlToText = (html: string): string => {
  const div = document.createElement("div");
  
  // 改行相当のタグを \n に変換しておく
  const withNewlines = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n");

  div.innerHTML = withNewlines;
  return div.textContent ?? div.innerText ?? "";
};