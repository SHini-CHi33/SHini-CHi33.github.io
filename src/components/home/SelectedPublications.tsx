
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { Publication } from '@/types/publication';
import { useMessages } from '@/lib/i18n/useMessages';
import FormattedBibTeXText from '@/components/publications/FormattedBibTeXText';
import styles from './SelectedPublications.module.css';

interface SelectedPublicationsProps {
    publications: Publication[];
    title?: string;
    enableOnePageMode?: boolean;
}


function getDoiUrl(doi?: string): string | undefined {
    if (!doi) return undefined;

    return doi.startsWith('http')
        ? doi
        : `https://doi.org/${doi}`;
}

function getPublicationUrl(pub: Publication): string | undefined {
    return (
        pub.website ||
        (pub.arxivId
            ? `https://arxiv.org/abs/${pub.arxivId}`
            : undefined) ||
        pub.url ||
        getDoiUrl(pub.doi) ||
        pub.pdfUrl
    );
}

function getPreviewUrl(preview?: string): string | undefined {
    if (!preview) return undefined;

    if (preview.startsWith('http://') || preview.startsWith('https://')) {
        return preview;
    }

    return `/${preview.replace(/^\.?\//, '')}`;
}


function getGitHubRepo(pubCode?: string): string | undefined {
    if (!pubCode) return undefined;

    try {
        const url = new URL(pubCode);

        if (url.hostname !== 'github.com' && url.hostname !== 'www.github.com') {
            return undefined;
        }

        const parts = url.pathname.split('/').filter(Boolean);

        if (parts.length < 2) return undefined;

        const owner = parts[0];
        const repo = parts[1].replace(/\.git$/i, '');

        return `${owner}/${repo}`;
    } catch {
        return undefined;
    }
}

// 缓存已经读取的 Star 数量，避免同一个仓库重复请求
const githubStarCache = new Map<string, number>();
const githubStarRequests = new Map<string, Promise<number | null>>();

function fetchGitHubStars(repo: string): Promise<number | null> {
    const cached = githubStarCache.get(repo);

    if (cached !== undefined) {
        return Promise.resolve(cached);
    }

    const pending = githubStarRequests.get(repo);

    if (pending) {
        return pending;
    }

    const request = fetch(`https://api.github.com/repos/${repo}`, {
        headers: {
            Accept: 'application/vnd.github+json',
        },
    })
        .then(async (response) => {
            if (!response.ok) return null;

            const data = await response.json() as {
                stargazers_count?: number;
            };

            if (typeof data.stargazers_count !== 'number') {
                return null;
            }

            githubStarCache.set(repo, data.stargazers_count);

            return data.stargazers_count;
        })
        .catch(() => null)
        .finally(() => {
            githubStarRequests.delete(repo);
        });

    githubStarRequests.set(repo, request);

    return request;
}



function getVenueBadge(pub: Publication): string {
    if (pub.arxivId || pub.type === 'preprint') {
        return `arXiv ${pub.year}`;
    }

    const venue = pub.conference || pub.journal || pub.venue || '';

    // Extract conference abbreviations such as ICM and ICCP.
    const acronym = venue.match(/\(([A-Z0-9&-]{2,12})\)\s*$/)?.[1];

    const abbreviations: Record<string, string> = {
        'Journal of Computational Physics': 'J. Comput. Phys.',
        'Annals of Probability': 'Ann. Probab.',
        'Physical Review E': 'Phys. Rev. E',
    };

    const shortVenue = acronym || abbreviations[venue] || venue;

    return `${shortVenue || pub.type.toUpperCase()} ${pub.year}`;
}


function ArxivIcon() {
    return (
        <img
            className={`${styles.actionIcon} ${styles.arxivIcon}`}
            src="https://arxiv.github.io/design-system/docs/assets/images/bones/icon_small-smileybones.svg"
            alt=""
            aria-hidden="true"
        />
    );
}

function PdfIcon() {
    return (
        <svg
            className={styles.actionIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
            <path d="M8 13h8" />
            <path d="M8 17h8" />
        </svg>
    );
}

function GithubIcon() {
    return (
        <svg
            className={styles.actionIcon}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
        >
            <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.93.58.1.79-.25.79-.56v-2.16c-3.2.7-3.87-1.36-3.87-1.36-.53-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.2-3.1-.12-.3-.52-1.48.12-3.07 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 5.82 0c2.22-1.5 3.2-1.18 3.2-1.18.64 1.59.24 2.77.12 3.07.75.81 1.2 1.84 1.2 3.1 0 4.43-2.7 5.41-5.27 5.69.42.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
        </svg>
    );
}

function WebsiteIcon() {
    return (
        <svg
            className={styles.actionIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18" />
            <path d="M12 3a15 15 0 0 1 0 18" />
            <path d="M12 3a15 15 0 0 0 0 18" />
        </svg>
    );
}

function StarIcon() {
    return (
        <svg
            className={styles.githubStarIcon}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
        >
            <path d="m12 2.5 2.93 5.94 6.56.95-4.75 4.63 1.12 6.54L12 17.47l-5.86 3.09 1.12-6.54L2.5 9.39l6.57-.95L12 2.5z" />
        </svg>
    );
}




function PublicationEntry({
    pub,
    index,
}: {
    pub: Publication;
    index: number;
}) {
    const [bibOpen, setBibOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const githubRepo = getGitHubRepo(pub.code);
    const [githubStars, setGithubStars] = useState<number | null>(null);

    useEffect(() => {
        if (!githubRepo) {
            setGithubStars(null);
            return;
        }

        let active = true;

        fetchGitHubStars(githubRepo).then((count) => {
            if (active) {
                setGithubStars(count);
            }
        });

        return () => {
            active = false;
        };
    }, [githubRepo]);

    const href = getPublicationUrl(pub);
    const preview = getPreviewUrl(pub.preview);

    const badgeVariant =
        pub.type === 'preprint' || pub.arxivId
            ? styles.venueBadgePreprint
            : pub.type === 'journal'
                ? styles.venueBadgeJournal
                : styles.venueBadgeConference;

    const hasCorresponding = pub.authors.some(
        (author) => author.isCorresponding
    );

    const hasCoFirst = pub.authors.some(
    (author) => author.isCoAuthor
);


    const handleCopyBibTeX = async () => {
        if (!pub.bibtex) return;

        try {
            await navigator.clipboard.writeText(pub.bibtex);
            setCopied(true);
        } catch {
            setCopied(false);
        }
    };

    const mediaContent = (
        <>
            <span className={`${styles.venueBadge} ${badgeVariant}`}>
                {getVenueBadge(pub)}
            </span>

            {preview ? (
                <img
                    src={preview}
                    alt={`Preview of ${pub.title}`}
                />
            ) : (
                <div className={styles.imagePlaceholder}>
                    <span>{pub.year}</span>
                    <small>PUBLICATION</small>
                </div>
            )}
        </>
    );

    return (
        <motion.li
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.4,
                delay: 0.08 * index,
            }}
            className={styles.publicationEntry}
        >
            {/* Left: 16:9 paper preview */}
            {href ? (
                <a
                    className={styles.publicationMedia}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${pub.title}`}
                >
                    {mediaContent}
                </a>
            ) : (
                <div className={styles.publicationMedia}>
                    {mediaContent}
                </div>
            )}

            {/* Right: publication information */}
            <div className={styles.publicationContent}>
                <div className={styles.paperDetails}>
                    <h3 className={styles.paperTitle}>
                        {href ? (
                            <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FormattedBibTeXText
                                    nodes={pub.titleNodes}
                                    fallback={pub.title}
                                />
                            </a>
                        ) : (
                            <FormattedBibTeXText
                                nodes={pub.titleNodes}
                                fallback={pub.title}
                            />
                        )}
                    </h3>

                    <div className={styles.paperAuthors}>
                        {pub.authors.map((author, idx) => (
                            <span key={idx}>
                                <span
                                    className={[
                                        author.isHighlighted || author.isMainAuthor
                                            ? styles.authorHighlight
                                            : '',
                                        author.isCoAuthor
                                            ? styles.authorCoauthor
                                            : '',
                                    ].filter(Boolean).join(' ')}
                                >
                                    {author.name}
                                </span>

                                {author.isCoAuthor && (
                                    <sup className={styles.authorMark}>*</sup>
                                )}

                                {author.isCorresponding && (
                                    <sup className={styles.authorMark}>†</sup>
                                )}

                                {idx < pub.authors.length - 1 && ', '}
                            </span>
                        ))}
                    </div>

                    {(hasCoFirst || hasCorresponding) && (
                        <div className={styles.paperNotes}>
                            {hasCoFirst && <span>* Equal contribution. </span>}
                            {hasCorresponding && <span>† Corresponding author.</span>}
                        </div>
                    )}

                    <div className={styles.paperVenue}>
                        {pub.journal || pub.conference || pub.venue}
                        {pub.year ? `, ${pub.year}` : ''}
                    </div>
                </div>

                {/* Paper links */}
                <div className={styles.paperActions}>
                    {pub.arxivId && (
                        <a
                            className={`${styles.paperAction} ${styles.actionArxiv}`}
                            href={`https://arxiv.org/abs/${pub.arxivId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <ArxivIcon />
                            <span>arXiv</span>
                        </a>
                    )}

                    {pub.url && (
                        <a
                            className={`${styles.paperAction} ${styles.actionPaper}`}
                            href={pub.url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <span>Paper</span>
                        </a>
                    )}

                    {pub.pdfUrl && (
                        <a
                            className={`${styles.paperAction} ${styles.actionPdf}`}
                            href={pub.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <PdfIcon />
                            <span>PDF</span>
                        </a>
                    )}

                    {pub.doi && (
                        <a
                            className={`${styles.paperAction} ${styles.actionDoi}`}
                            href={getDoiUrl(pub.doi)}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            DOI
                        </a>
                    )}

                    {pub.code && (
                        <a
                            className={`${styles.paperAction} ${styles.actionCode}`}
                            href={pub.code}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <GithubIcon />
                            <span>GitHub</span>

                            {githubStars !== null && (
                                <span className={styles.githubStars}>
                                    <StarIcon />
                                    {githubStars.toLocaleString('en-US')}
                                </span>
                            )}
                        </a>
                    )}

                    {pub.website && (
                        <a
                            className={`${styles.paperAction} ${styles.actionWebsite}`}
                            href={pub.website}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <WebsiteIcon />
                            <span>Website</span>
                        </a>
                    )}

                    {pub.bibtex && (
                        <button
                            type="button"
                            className={`${styles.paperAction} ${styles.actionBib}`}
                            onClick={() => {
                                setBibOpen(!bibOpen);
                                setCopied(false);
                            }}
                            aria-expanded={bibOpen}
                        >
                            BibTeX {bibOpen ? '−' : '+'}
                        </button>
                    )}
                </div>
                {/* Expandable BibTeX */}
                {bibOpen && pub.bibtex && (
                    <div className={styles.bibtexPanel}>
                        <div className={styles.bibtexHeader}>
                            <span>BibTeX</span>

                            <button
                                type="button"
                                className={styles.copyBib}
                                onClick={handleCopyBibTeX}
                            >
                                {copied ? 'Copied ✓' : 'Copy'}
                            </button>
                        </div>

                        <pre>
                            <code>{pub.bibtex}</code>
                        </pre>
                    </div>
                )}
            </div>
        </motion.li>
    );
}

export default function SelectedPublications({
    publications,
    title,
}: SelectedPublicationsProps) {
    const messages = useMessages();
    const resolvedTitle = title || messages.home.selectedPublications;

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <h2 className="text-2xl font-serif font-bold text-primary mb-5">
                {resolvedTitle}
            </h2>

            <ul className={styles.publicationList}>
                {publications.map((pub, index) => (
                    <PublicationEntry
                        key={pub.id}
                        pub={pub}
                        index={index}
                    />
                ))}
            </ul>
        </motion.section>
    );
}
