import { redirect } from 'next/navigation'
import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents } from '../../mdx-components'

export const generateStaticParams = generateStaticParamsFor('mdxPath')

type PageProps = {
  params: Promise<{ mdxPath?: string[] }>
}

export async function generateMetadata(props: PageProps) {
  const params = await props.params
  if (!params.mdxPath) return {}
  const { metadata } = await importPage(params.mdxPath)
  return metadata
}

export default async function Page(props: PageProps) {
  const params = await props.params

  // "/" → redirect vers /docs
  if (!params.mdxPath || params.mdxPath.length === 0) {
    redirect('/docs')
  }

  const result = await importPage(params.mdxPath)
  const { default: MDXContent, toc, metadata, sourceCode } = result
  const { wrapper: Wrapper } = useMDXComponents({})
  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      <MDXContent {...props} params={params} />
    </Wrapper>
  )
}