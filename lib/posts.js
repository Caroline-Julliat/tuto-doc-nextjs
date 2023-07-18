import fs from "fs"
import path from "path"
// install gray-matter which lets us parse the metadata in each markdown file.
import matter from "gray-matter"
// install remark library to render markdown content
import { remark } from "remark"
import html from "remark-html"

const postsDirectory = path.join(process.cwd(), "posts")

export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, "")

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, "utf8")

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // Combine the data with the id
    return {
      id,
      ...matterResult.data,
    }
  })
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory)

  // Returns an array that looks like this:
  // [
  //   {
  //     params: {
  //       id: 'ssg-ssr'
  //     }
  //   },
  //   {
  //     params: {
  //       id: 'pre-rendering'
  //     }
  //   }
  // ]
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    }
  })
}

export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, "utf8")

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents)

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)
  const contentHtml = processedContent.toString()

  // Combine the data with the id
  return {
    id,
    contentHtml,
    ...matterResult.data,
  }
}

// Vous n'avez pas besoin de comprendre ce que fait le code ci-dessus pour apprendre Next.js, la fonction est de rendre l'exemple de blog fonctionnel. Mais si vous souhaitez en savoir plus :

// fsest un module Node.js qui vous permet de lire des fichiers à partir du système de fichiers.
// pathest un module Node.js qui vous permet de manipuler les chemins de fichiers.
// matterest une bibliothèque qui vous permet d'analyser les métadonnées dans chaque fichier Markdown.
// Dans Next.js, le libdossier n'a pas de nom attribué comme le pagesdossier, vous pouvez donc lui donner n'importe quel nom. Il est généralement conventionnel d'utiliser libou utils.

// -----------------------------------------------

// you can fetch the data from other sources, like an external API endpoint

// export async function getSortedPostsData() {
//   // Instead of the file system,
//   // fetch post data from an external API endpoint
//   const res = await fetch('..');
//   return res.json();
// }

// You can also query the database directly:

// import someDatabaseSDK from 'someDatabaseSDK'

// const databaseClient = someDatabaseSDK.createClient(...)

// export async function getSortedPostsData() {
//   // Instead of the file system,
//   // fetch post data from a database
//   return databaseClient.query('SELECT posts...')
// }
