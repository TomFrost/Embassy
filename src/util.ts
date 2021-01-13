import { DomainKey, DomainScopes, ScopeLoopFunction } from './types'

/**
 * Given an array of combined scope strings in the format `domain|scope` or just
 * `scope`, will provide a mapping of all domains in the array to the scopes
 * that appeared for them. Strings with no `domain|` prefix will use the default
 * "app" scope.
 *
 * @param combined - An array of strings in the format `domain|scope`. If the
 * domain portion is missing, the default scope of "app" will be used.
 * @returns a map of domains to arrays of scopes within that domain
 */
export function combinedToDomainScopes(combined: string[]): DomainScopes {
  const domainScopes: DomainScopes = combined.reduce((acc, str) => {
    const split = splitCombined(str)
    if (!acc[split.domain]) acc[split.domain] = []
    acc[split.domain].push(split.key)
    return acc
  }, {})
  return domainScopes
}

/**
 * Runs a given function across each provided scope.
 *
 * @param domainScopesOrCombined - A DomainScopes map or scopes against which to
 * execute the function, or an array of combined-format domain|scope strings
 * @param fn - The function to execute for each domain/scope pair, iteratively.
 */
export async function forEachScope(
  domainScopesOrCombined: DomainScopes | string[],
  fn: ScopeLoopFunction
): Promise<void> {
  // Convert whatever we have to a DomainScopes map
  const domainScopes = Array.isArray(domainScopesOrCombined)
    ? combinedToDomainScopes(domainScopesOrCombined)
    : domainScopesOrCombined
  const domains = Object.keys(domainScopes)
  let broke = false
  const breakFn = () => {
    broke = true
  }
  // Iterate through every domain in the map
  for (const domainIdx in domains) {
    const domain = domains[domainIdx]
    const scopes = domainScopes[domain]
    // Iterate through every scope string in that domain's scopes array
    for (const scopeIdx in scopes) {
      await fn(domain, scopes[scopeIdx], breakFn)
      if (broke) break
    }
    if (broke) break
  }
}

/**
 * Given a string that may have a domain included in the format `domain|key`
 * or `domain|complex|key`, returns an object that splits out the domain up
 * to the first `|` symbol. The examples above would result in:
 *
 * ```typescript
 * { domain: 'domain', key: 'key' } // First
 * { domain: 'domain', key: 'complex|key' } // Second
 * ```
 *
 * In the event a `|` character is not included, the default domain "app" will
 * be used.
 *
 * @param combined - A string that may have a `domain:` prefix
 * @returns an object defining the components of the combined string
 */
export function splitCombined(combined: string): DomainKey {
  const match = combined.match(/^([^|]+)\|(.+)$/)
  if (!match) return { domain: 'app', key: combined }
  return { domain: match[1], key: match[2] }
}
