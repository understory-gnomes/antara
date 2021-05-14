import Head from 'next/head'
import { getUrl, getStringNoLocale } from '@inrupt/solid-client'

import NoteBody from '../components/NoteBody'
import { loadConcept, loadPublicGnomeConfig, UG } from 'gatekit'
import { getPaymentPointer } from '../monetization'

export async function getStaticProps(context) {
  const gnomeConfigUrl = process.env.GNOME_CONFIG_URL
  const { config } = await loadPublicGnomeConfig(gnomeConfigUrl)
  const conceptPrefix = getStringNoLocale(config, UG.conceptPrefix)
  const conceptUrl = getUrl(config, UG.usesConcept)
  const conceptIndexUrl = getUrl(config, UG.usesConceptIndex)
  const { name, body } = await loadConcept(conceptIndexUrl, conceptUrl)
  const customCSS = getStringNoLocale(config, UG.usesCSS)
  const webId = getUrl(config, UG.monetizedFor)
  const paymentPointer = webId && await getPaymentPointer(webId)
  return {
    props: { conceptPrefix, name, body, customCSS, paymentPointer }, // will be passed to the page component as props
    revalidate: 10
  }
}

export default function Home({ conceptPrefix, name, body, customCSS, paymentPointer }) {
  return (
    <>
      <Head>
        <title>Understory</title>
        {paymentPointer && (
          <meta name="monetization" content={paymentPointer} />
        )}
        {customCSS && (
          <style>{customCSS}</style>
        )}
      </Head>
      <main className="min-h-screen">
        <section class="content">
          <div className="note-body">
            <NoteBody json={body} conceptPrefix={conceptPrefix} />
          </div>
        </section>
      </main>
    </>
  )
}
