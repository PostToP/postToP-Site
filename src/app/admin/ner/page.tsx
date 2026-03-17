"use client";

import {useEffect, useRef, useState} from "react";
import Card from "@/components/Card/Card";
import AdminBackend from "@/utils/Backend/AdminBackend";

function sendReview(data: any) {
    return AdminBackend.submitNERReview(data);
}

async function askAI(watchID: string) {
    const asd = await AdminBackend.getAIPrediction({watchID});
    if (!asd.ok) {
        throw new Error(asd.error);
    }
    return asd.data;
}

const NER_COLORS: {[key: string]: string} = {
    TITLE: "#fbbf24",
    ALT_TITLE: "#fb923c",
    ALBUM: "#f87171",
    FEATURING: "#c084fc",
    MODIFIER: "#60a5fa",
    ORIGINAL_AUTHOR: "#4ade80",
    VOCALIST: "#2dd4bf",
    MISC_PERSON: "#f472b6",
    VOCALOID: "#d97706",
};

function getSelectionOffsets(container: HTMLElement, fill = true) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;

    const range = selection.getRangeAt(0);

    if (!container.contains(range.startContainer)) return null;

    const preRange = range.cloneRange();
    preRange.selectNodeContents(container);
    preRange.setEnd(range.startContainer, range.startOffset);

    let start = preRange.toString().length;
    let selectedText = range.toString();
    let end = start + selectedText.length;

    if (!fill) {
        return {start, end, selectedText};
    }

    while (selectedText.endsWith(" ")) {
        selectedText = selectedText.slice(0, -1);
        end -= 1;
    }
    while (selectedText.startsWith(" ")) {
        selectedText = selectedText.slice(1);
        start += 1;
    }

    const regex = /([一-龠ぁ-ゔァ-ヴーａ-ｚＡ-Ｚ０-９々〆〤0-9゙゚áíóöőüéúűÁÍÚÜŰÓÖŐÉ]+|[a-zA-Z0-9]+)[.!]*/;
    const containerText = container.textContent || "";
    while (end < containerText.length && regex.test(containerText[end])) {
        selectedText += containerText[end];
        end += 1;
    }

    while (start > 0 && regex.test(containerText[start - 1])) {
        selectedText = containerText[start - 1] + selectedText;
        start -= 1;
    }

    return {start, end, selectedText};
}

function TextSelection({
    text,
    onSelection,
    ners,
    onDeletion,
}: {
    text: string;
    onSelection?: (selection: {start: number; end: number; selectedText: string}) => void;
    ners?: any[];
    onDeletion?: (ner: any) => void;
}) {
    const ref = useRef<HTMLDivElement>(null);

    const handleMouseUp = (event: any) => {
        if (!ref.current) return;
        let result = getSelectionOffsets(ref.current);
        if (event.button === 2 && result) {
            result = getSelectionOffsets(ref.current, false);
            event.preventDefault();
            if (onDeletion) {
                const nerToDelete = ners?.find(ner => ner.start <= result!.start && ner.end >= result!.end);
                if (nerToDelete) {
                    onDeletion(nerToDelete);
                }
            }
            return;
        }

        if (result && onSelection) {
            onSelection(result);
        }
    };

    useEffect(() => {
        if (ners && ref.current) {
            let highlightedText = text;
            const sortedNers = [...ners].sort((a, b) => b.start - a.start);
            for (const ner of sortedNers) {
                const before = highlightedText.slice(0, ner.start);
                const entity = highlightedText.slice(ner.start, ner.end);
                const after = highlightedText.slice(ner.end);
                highlightedText = `${before}<mark style="background-color: ${NER_COLORS[ner.type] || "gray"};" title="${
                    ner.type
                }">${entity}</mark>${after}`;
            }
            ref.current.innerHTML = highlightedText;
        }
    }, [ners, text]);

    useEffect(() => {
        const handleContextmenu = (e: any) => {
            e.preventDefault();
        };
        document.addEventListener("contextmenu", handleContextmenu);
        return function cleanup() {
            document.removeEventListener("contextmenu", handleContextmenu);
        };
    }, []);

    return (
        <div
            ref={ref}
            onMouseUp={handleMouseUp}
            className="whitespace-pre-wrap leading-relaxed"
            style={{userSelect: "text"}}>
            {text}
        </div>
    );
}

function unicodeToUtf16Index(text: string, unicodeIndex: number): number {
    // let utf16Index = 0;
    // let currentUnicodeIndex = 0;

    // while (currentUnicodeIndex < unicodeIndex && utf16Index < text.length) {
    //   const codePoint = text.codePointAt(utf16Index);
    //   if (codePoint && codePoint >= 0x10000) {
    //     utf16Index += 2;
    //   } else {
    //     utf16Index += 1;
    //   }
    //   currentUnicodeIndex += 1;
    // }

    // return utf16Index;
    return unicodeIndex;
}

export default function Page() {
    const [res, setRes] = useState({} as any);
    const selectedText = useRef<{start: number; end: number; selectedText: string; source: string} | null>(null);
    const [nerElements, setNerElements] = useState<any[]>([]);
    const [left, setLeft] = useState(0);
    const [aiRes, setAiRes] = useState(null as any);
    const resRef = useRef(res);
    useEffect(() => {
        resRef.current = res;
    }, [res]);

    function showNext() {
        AdminBackend.getVideos({
            limit: "1",
            verified: "true",
            sortBy: "random",
            music: "true",
            hasNER: "false",
        })
            .then(response => {
                if (!response.ok) {
                    console.error("Error fetching next item:", response.error);
                    return;
                }
                const data = response.data;
                setNerElements([]);
                setRes(data.videos[0]);
                resRef.current = data.videos[0];
                setLeft(data.pagination.totalVideos);
                askAI(data.videos[0].yt_id).then(aiData => {
                    const res = aiData.prediction.entities;
                    const aiNers = res.map((item: any) => {
                        const type = item[0];
                        const selectedText = item[1];
                        let start = item[2];
                        let end = item[3];
                        const isTitle = start < data.videos[0].title.length;
                        const titleOffset = isTitle ? 0 : resRef.current.title.length + 7; // +1 for the newline character between title and description
                        if (!isTitle) {
                            start -= titleOffset;
                            end -= titleOffset;
                        }
                        return {
                            type,
                            selectedText,
                            start: unicodeToUtf16Index(
                                isTitle ? resRef.current.title : resRef.current.description,
                                start,
                            ),
                            end: unicodeToUtf16Index(isTitle ? resRef.current.title : resRef.current.description, end),
                            source: isTitle ? "title" : "description",
                        };
                    });
                    setNerElements(aiNers);
                    setAiRes(aiNers);
                });
            })
            .catch(error => {
                console.error("Error fetching next item:", error);
            });
    }

    function getAllOccurrences(str: string, subStr: string) {
        const positions = [];
        const lowerStr = str.toLowerCase();
        const lowerSubStr = subStr.toLowerCase();
        let pos = lowerStr.indexOf(lowerSubStr);
        while (pos !== -1) {
            positions.push({start: pos, end: pos + subStr.length, selectedText: str.slice(pos, pos + subStr.length)});
            pos = lowerStr.indexOf(lowerSubStr, pos + subStr.length);
        }
        return positions;
    }

    function addNerElement(element: any) {
        let occurrences = getAllOccurrences(resRef.current.title, element.selectedText);
        occurrences = occurrences.filter((occ: any) => {
            return !nerElements.some(ne => ne.start <= occ.start && ne.end >= occ.end && ne.source === "title");
        });

        for (const occ of occurrences) {
            setNerElements(prev => [...prev, {...occ, type: element.type, source: "title"}]);
        }
        occurrences = getAllOccurrences(resRef.current.description, element.selectedText);

        occurrences = occurrences.filter((occ: any) => {
            return !nerElements.some(ne => ne.start <= occ.start && ne.end >= occ.end && ne.source === "description");
        });
        for (const occ of occurrences) {
            setNerElements(prev => [...prev, {...occ, type: element.type, source: "description"}]);
        }
    }

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code === "Space") {
                event.preventDefault();
                addNerElement({
                    ...selectedText.current,
                    type: "TITLE",
                });
            } else if (event.code === "KeyN") {
                event.preventDefault();
                showNext();
            } else if (event.code === "Enter") {
                event.preventDefault();
                sendReview({
                    watchID: resRef.current.yt_id,
                    language: resRef.current.language,
                    namedEntities: nerElements,
                }).then(() => {
                    setNerElements([]);
                    selectedText.current = null;
                    showNext();
                });
            } else if (event.code === "Digit1") {
                event.preventDefault();
                addNerElement({...selectedText.current, type: "ORIGINAL_AUTHOR"});
            } else if (event.code === "Digit2") {
                event.preventDefault();
                addNerElement({...selectedText.current, type: "MISC_PERSON"});
            } else if (event.code === "Digit3") {
                event.preventDefault();
                addNerElement({...selectedText.current, type: "VOCALIST"});
            } else if (event.code === "Digit4") {
                event.preventDefault();
                addNerElement({...selectedText.current, type: "MODIFIER"});
            } else if (event.code === "Digit5") {
                event.preventDefault();
                addNerElement({...selectedText.current, type: "ALBUM"});
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [nerElements]);

    useEffect(() => {
        showNext();
    }, []);

    function secondToTimeString(seconds: number) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    }

    const isLoading = res && Object.keys(res).length === 0;

    function submitCurrentReview() {
        sendReview({
            watchID: resRef.current.yt_id,
            language: resRef.current.language,
            namedEntities: nerElements,
        }).then(() => {
            setNerElements([]);
            selectedText.current = null;
            showNext();
        });
    }

    return (
        <main className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-text-secondary">Admin</p>
                    <h1 className="text-3xl font-semibold">NER Review</h1>
                    <p className="text-sm text-text-secondary">
                        Space → title tag · 1-5 to assign types · Enter to submit · N to skip
                    </p>
                </div>
                <Card className="max-w-xs">
                    <p className="text-sm text-text-secondary">Items left</p>
                    <p className="text-3xl font-semibold leading-tight">{left}</p>
                    <p className="text-xs text-text-secondary">Highlight text, tag it, and press Enter to submit.</p>
                </Card>
            </div>

            {isLoading ? (
                <Card className="flex items-center justify-center py-12 text-text-secondary">Loading next video…</Card>
            ) : (
                <div className="grid grid-cols-12 gap-6">
                    <Card className="col-span-12 xl:col-span-7 space-y-4">
                        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-[240px_1fr]">
                            <div className="overflow-hidden rounded-lg border border-border bg-surface">
                                <img
                                    src={`https://i.ytimg.com/vi/${res.yt_id}/hqdefault.jpg`}
                                    alt="Music thumbnail"
                                    className="h-full w-full object-cover"
                                />
                                <div className="flex items-center justify-between px-3 py-2 text-sm text-text-secondary">
                                    <span className="font-semibold text-text-primary">
                                        {secondToTimeString(res.duration)}
                                    </span>
                                    <span className="rounded-full bg-border/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em]">
                                        {res.language || "Unknown"}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-text-secondary">Title</p>
                                    <div className="mt-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm leading-relaxed shadow-sm">
                                        <TextSelection
                                            ners={nerElements.filter(i => i.source === "title")}
                                            text={res.title}
                                            onSelection={i => {
                                                selectedText.current = {...i, source: "title"};
                                            }}
                                            onDeletion={i => {
                                                setNerElements(prev =>
                                                    prev.filter(
                                                        el =>
                                                            !(
                                                                el.start === i.start &&
                                                                el.end === i.end &&
                                                                el.source === "title"
                                                            ),
                                                    ),
                                                );
                                            }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-text-secondary">Description</p>
                                    <div className="mt-2 max-h-64 overflow-auto rounded-lg border border-border bg-surface px-3 py-2 text-sm leading-relaxed shadow-sm">
                                        <TextSelection
                                            ners={nerElements.filter(i => i.source === "description")}
                                            text={res.description}
                                            onSelection={i => {
                                                selectedText.current = {...i, source: "description"};
                                            }}
                                            onDeletion={i => {
                                                setNerElements(prev =>
                                                    prev.filter(
                                                        el =>
                                                            !(
                                                                el.start === i.start &&
                                                                el.end === i.end &&
                                                                el.source === "description"
                                                            ),
                                                    ),
                                                );
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {aiRes && aiRes.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-sm text-text-secondary">AI suggestions</p>
                                <div className="flex flex-wrap gap-2">
                                    {aiRes.map((item: any, idx: number) => (
                                        <span
                                            key={`${item.selectedText}-${item.start}-${idx}`}
                                            className="rounded-full bg-border/60 px-3 py-1 text-xs font-semibold text-text-primary">
                                            {item.selectedText} — {item.type}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Card>

                    <Card className="col-span-12 xl:col-span-5 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <p className="text-sm text-text-secondary">Tagged entities</p>
                                <h2 className="text-xl font-semibold">Named entities</h2>
                            </div>
                            <button
                                type="button"
                                onClick={showNext}
                                className="rounded-lg border border-border px-3 py-2 text-sm font-semibold hover:border-text-secondary hover:text-text-primary">
                                Skip (N)
                            </button>
                        </div>

                        <div className="overflow-hidden rounded-lg border border-border">
                            <table className="w-full text-sm">
                                <thead className="bg-surface text-text-secondary">
                                    <tr className="text-left">
                                        <th className="px-3 py-2">Start</th>
                                        <th className="px-3 py-2">End</th>
                                        <th className="px-3 py-2">Text</th>
                                        <th className="px-3 py-2">Source</th>
                                        <th className="px-3 py-2">Type</th>
                                        <th className="px-3 py-2">Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {nerElements.map((el, idx) => (
                                        <tr key={idx} className="border-t border-border">
                                            <td className="px-3 py-2 text-text-secondary">{el.start}</td>
                                            <td className="px-3 py-2 text-text-secondary">{el.end}</td>
                                            <td className="px-3 py-2 font-medium">{el.selectedText}</td>
                                            <td className="px-3 py-2 text-text-secondary">{el.source}</td>
                                            <td className="px-3 py-2">
                                                <select
                                                    className="w-full rounded-lg border border-border bg-surface px-2 py-1 text-sm"
                                                    onChange={e => {
                                                        const newType = e.target.value;
                                                        const indicesWithSameText = nerElements
                                                            .map((item, index) =>
                                                                item.selectedText.toLowerCase() ===
                                                                el.selectedText.toLowerCase()
                                                                    ? index
                                                                    : -1,
                                                            )
                                                            .filter(index => index !== -1);
                                                        // biome-ignore lint/complexity/noForEach: <explanation>
                                                        indicesWithSameText.forEach(i => {
                                                            setNerElements(prev => {
                                                                const newElements = [...prev];
                                                                newElements[i] = {...newElements[i], type: newType};
                                                                return newElements;
                                                            });
                                                        });
                                                    }}
                                                    value={el.type}>
                                                    <option value="TITLE">Title</option>
                                                    <option value="ALT_TITLE">ALT Title</option>
                                                    <option value="ALBUM">Album</option>
                                                    <option value="FEATURING">Featuring</option>
                                                    <option value="MODIFIER">Modifier</option>
                                                    <option value="ORIGINAL_AUTHOR">Original Author</option>
                                                    <option value="VOCALIST">Vocalist</option>
                                                    <option value="MISC_PERSON">Misc Person</option>
                                                    <option value="VOCALOID">Vocaloid</option>
                                                </select>
                                            </td>
                                            <td className="px-3 py-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setNerElements(prev => prev.filter((_, i) => i !== idx));
                                                    }}
                                                    className="rounded-lg border border-border px-3 py-1 text-xs font-semibold hover:border-text-secondary hover:text-text-primary">
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={submitCurrentReview}
                                className="rounded-lg bg-accent-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-110">
                                Submit review (Enter)
                            </button>
                            <button
                                type="button"
                                onClick={showNext}
                                className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:border-text-secondary hover:text-text-primary">
                                Skip (N)
                            </button>
                        </div>
                    </Card>
                </div>
            )}
        </main>
    );
}
