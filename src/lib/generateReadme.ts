import { appendContent } from "./appendContent"
import { main } from "./gemini"
import { getRepoFileStructure } from "./github"


interface Writer {
    write: (chunk: string) => Promise<void>
    end: () => Promise<void>
}

export async function generateReadme(
    url: string,
    branch: string,
    accessToken: string,
    writer: Writer        // ✅ replace Express `res` with `writer`
) {
    try {
        const repoData = await getRepoFileStructure(url, branch, accessToken)
        if (!repoData) {
            throw new Error("Failed to fetch repository structure.")
        }
        const { Content, repo } = repoData
        const FullContent = appendContent(Content)
        const data = await main(FullContent)

        for await (const chunk of data) {
            const text = chunk.candidates?.[0]?.content?.parts?.[0]?.text  // @google/genai structure
            if (text) {
                await writer.write(text)
            }
        }

    } catch (err) {
        console.error('Error writing file:', err)
        await writer.write('Error generating readme')
    } finally {
        await writer.end()                   // ✅ always close the stream
    }
}