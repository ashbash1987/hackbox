import DOMPurify from "dompurify";
import { marked } from "marked";

export default (text: string) => DOMPurify.sanitize(marked.parse(text));
