
export function appendContent(CONTENT: String) {
    let content = `You are an expert open-source documentation writer.

Generate a professional README.md.

Rules:
- Output ONLY README.md
- No explanations
- Use GitHub markdown

FILES:
${CONTENT}
`;
    return content;
}
