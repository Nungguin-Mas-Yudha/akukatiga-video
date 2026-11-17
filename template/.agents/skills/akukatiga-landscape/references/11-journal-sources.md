# Journal sources: papers, full text and figures

## Goal

Every scientific claim and every scientific picture in a film comes from the literature itself, not from a blog's
retelling. The film's explanation of a mechanism is checked against a paper that states it, and its drawing of that
mechanism (an energy diagram, a crystal, a reaction) is redrawn from that paper's own figure, or shown directly when
the licence allows.

## The tool

`node scripts/journal.mjs` (from `engine/full-visual-landscape/`):
- `search "<query>"` lists open papers from Europe PMC, arXiv and OpenAlex, each with its licence.
- `text <PMCID | DOI | arXiv:ID> --film <film>` saves the full text (`text.md`), the figure list with captions
  (`figures.json`) and the source record (`source.json`) in `films/<film>/research/<id>/`.
- `figures <PMCID | arXiv:ID> --film <film>` saves every figure image with its caption and the credit line. A CC BY or
  CC0 figure goes to `figures/` (may appear on screen, credited); anything else goes to `reference/` (redraw only).

Fetching (search, text, figures) is Haiku work; reading the paper, judging what it supports and choosing figures is
Opus work, as the folder's model rule says.

## Where full text and figures can be taken

| Source | Fields | Full text | Figures | Default licence | Route |
|---|---|---|---|---|---|
| **Europe PMC / PubMed Central (open-access subset)** | life sciences, plus many physical-science journals that deposit there (Nature Communications, Scientific Reports, Advanced Science, MDPI journals, RSC Advances, ACS Omega, Frontiers, PLOS ONE) | yes, structured XML | yes, from the PMC page | per article; most are CC BY | `journal.mjs text/figures PMC…` |
| **arXiv** | physics, mathematics, computer science, materials, quantitative biology | yes, HTML version for recent papers | yes, from the HTML version | arXiv's own licence grants no reuse unless the author chose CC BY / CC0 | `journal.mjs text/figures arXiv:…` |
| **Nature Communications, Scientific Reports, Communications journals** | all sciences | open access | yes | CC BY 4.0 | via Europe PMC (nature.com blocks scripted reading) |
| **PLOS (ONE, Biology, Physics-adjacent)** | all sciences | open | yes | CC BY 4.0 | via Europe PMC |
| **MDPI (Energies, Batteries, Materials, Nanomaterials, Molecules…)** | engineering, chemistry, materials | open | yes | CC BY 4.0 | via Europe PMC, or the article page |
| **Frontiers (Energy Research, Chemistry, Physics…)** | all sciences | open | yes | CC BY 4.0 | via Europe PMC, or the article page |
| **RSC open journals (Chemical Science, RSC Advances, Energy Advances…)** | chemistry | open | yes | CC BY 3.0/4.0 (some CC BY-NC: check) | via Europe PMC, or the article page |
| **ACS Omega, ACS Central Science, JACS Au** | chemistry | open | yes | CC BY or CC BY-NC-ND: check each | via Europe PMC |
| **IOP open journals (New Journal of Physics, Journal of Physics: Energy…)** | physics | open | yes | CC BY 4.0 | the article page |
| **eLife, PNAS open-access articles** | biology, all sciences | open | yes | eLife CC BY; PNAS varies | via Europe PMC |
| **US government (NIST, NASA, DOE, NIH reports)** | all | open | yes | public domain in the US (credit anyway) | the agency page |
| **Wikimedia Commons scientific diagrams** | all | n/a | yes | per file (CC0, CC BY, CC BY-SA) | the file page |
| Subscription journals (JACS, Chem. Mater., Nature, Science, Elsevier, Springer, Wiley) | all | abstract only, unless an open copy exists | no | all rights reserved | OpenAlex `oa_url` may point to an open copy; otherwise cite, never show |

Notes from use (2026-10-30): nature.com and acs.org refuse scripted reading; Europe PMC's XML and the PMC page
work and carry the licence; Elsevier "open archive" and many OpenAlex hits are CC BY-NC-ND, which is reference only.
OpenAlex answers without a key from a shared daily budget; its responses ask for the user's email to make a key:
never send it without the creator's say-so.

## How a figure may be used

| Licence | On screen | As a reference to redraw from |
|---|---|---|
| CC0, public domain | yes, credited anyway | yes |
| CC BY (any version) | yes, with the credit line: authors, title, journal, year, DOI, licence, and "adapted" if we changed it | yes |
| CC BY-SA | avoid; only when nothing else exists, with the reason in `references.md` (share-alike may reach the film) | yes |
| CC BY-NC, CC BY-ND, all rights reserved, unknown | never | yes: redraw from the measured proportions, never trace line for line (`full-visual/references/11-image-assets.md`, References are free) |

A redrawn scientific figure keeps the paper's science exactly (the order of levels, the ratios, the labels) and is
credited as "after <authors>, <year>" in `references.md` and the description.

## How it feeds the film

1. **Research:** every mechanism row in `sources.md` names a paper read through this tool, with the section or
   figure that states it, and its excerpt (at most 3 sentences). A blog or encyclopedia alone never settles a
   mechanism.
2. **Script QC:** the Science Editor checks each mechanism step against its excerpt in `sources.md`, and greps
   `research/<id>/text.md` only at the named section when the excerpt is not enough. Never a whole paper.
3. **Visual plan:** each science scene names the figure it is drawn from (`research/<id>/figures.json`), and whether
   it is shown (CC BY) or redrawn. The scene is laid beside the figure in the check (`full-visual/references/object-references.md`, The check):
   the order, the ratios and the labels must match.
4. **Description:** every shown or adapted figure is credited.

## Example

Chapter 5 of the Goodenough film needs why an oxide gives about four volts. `journal.mjs text PMC7096394` returns
Manthiram, "A reflection on lithium-ion battery cathode chemistry", Nature Communications 2020, CC BY 4.0. Its
section "The discovery of oxide cathodes" states the mechanism (the top of the sulfur 3p band lies higher than the
oxygen 2p band, which caps a sulfide's voltage), and its Fig. 1 draws the energy levels of Li/Li+, Ti3+/4+ in TiS2,
S 3p, Co3+/4+ in LiCoO2 and O 2p. The film may show Fig. 1, credited, or redraw it in the brand's colours with the
same order of levels.
