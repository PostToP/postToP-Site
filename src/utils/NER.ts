export type NERResult = {
    ALBUM: string[] | null;
    ARTIST: string[] | null;
    VOCALIST: string[] | null;
    MODIFIER: string[] | null;
    TITLE: string[] | null;
    MISC_PERSON: string[] | null;
};

export default function formatNER(ner: NERResult | null, defaultTitle: string, defaultArtist: string) {
    let title = defaultTitle;
    let artist = defaultArtist.replace("- Topic", "").trim();

    if (ner) {
        const nerTitle = ner.TITLE && ner.TITLE.length > 0 ? ner.TITLE[0] : null;
        const nerArtist = ner.ARTIST && ner.ARTIST.length > 0 ? ner.ARTIST[0] : null;
        const modifiers = ner.MODIFIER || [];
        const modifierStr = modifiers.length ? ` (${modifiers.join(", ")})` : "";
        const performers = ner.VOCALIST || [];
        if (nerTitle) title = `${nerTitle}${modifierStr}`;
        if (nerArtist) artist = `${nerArtist}${modifierStr}`;
    }

    return {title, subtitle: artist};
}
