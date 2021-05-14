import { getSolidDataset, getStringNoLocale, getThing, getUrl } from '@inrupt/solid-client'
import * as base58 from 'micro-base58'


const VOCAB_PREFIX = "https://understory.coop/vocab/garden#"
export const UG = {
  noteBody: `${VOCAB_PREFIX}noteBody`,
  noteUrl: `${VOCAB_PREFIX}noteUrl`,
  usesConcept: `${VOCAB_PREFIX}usesConcept`,
  usesConceptIndex: `${VOCAB_PREFIX}usesConceptIndex`,
  conceptPrefix: `${VOCAB_PREFIX}conceptPrefix`,
  storedAt: `${VOCAB_PREFIX}storedAt`,
  usesCSS: `${VOCAB_PREFIX}usesCSS`,
  monetizedFor: `${VOCAB_PREFIX}monetizedFor`
}

export const conceptNameToUrlSafeId = (name) =>
  base58.encode(name.toLowerCase())

export const urlSafeIdToConceptName = (id) => {
  return new TextDecoder().decode(base58.decode(id))
}

export function conceptUriToName(conceptUri){
  return urlSafeIdToConceptName(conceptUri.split("#").slice(-1)[0])
}

export function noteUriToName(noteUri){
  return urlSafeIdToConceptName(noteUri.split("/").slice(-1)[0].split("\.")[0])
}

export function tagNameToUrlSafeId(tagName){
  return encodeURIComponent(tagName)
}

export async function loadNote(url){
  const name = noteUriToName(url)
  const noteResource = await getSolidDataset(url)
  const note = getThing(noteResource, url)
  const body = getStringNoLocale(note, UG.noteBody)
  return { name, body }
}

export async function loadConcept(indexUrl, url){
  const conceptIndex = await getSolidDataset(indexUrl)
  const concept = getThing(conceptIndex, url)
  const noteUrl = getUrl(concept, UG.storedAt)
  return loadNote(noteUrl)
}

export async function loadPublicGnomeConfig(url) {
  const gnomeConfigResource = await getSolidDataset(url)
  const gnomeConfigThing = getThing(gnomeConfigResource, url)
  const gnomeConfig = {
    url,
    config: gnomeConfigThing
  }
  return gnomeConfig
}
