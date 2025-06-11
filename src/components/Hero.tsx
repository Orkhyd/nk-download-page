import { useEffect, useState } from 'react'
import { detectPlatform } from '@/lib/utils';
import logoNk from "@/assets/logonk.png";
import screen from "@/assets/screen.png";
import GithubTag from './GithubTag';
import GithubDownloadButton from './GithubDownloadButton';

export interface GitHubRelease {
  tag_name: string;
  assets: GitHubAsset[];
  name: string;
  html_url: string;
  published_at: string;
}

interface GitHubAsset {
  name: string;
  browser_download_url: string;
  size: number;
  download_count: number;
  content_type: string;
}

export default function Hero() {
  const client = detectPlatform();
  const [latestRelease, setLatestRelease] = useState<GitHubRelease | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestRelease = async () => {
      setLoading(true);
      setError(null);

      const url = `https://api.github.com/repos/zen-browser/desktop/releases/latest`;

      try {
        const response = await fetch(url);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `GitHub API Error: ${errorData.message || response.statusText} (Status: ${response.status})`,
          );
        }

        const data: GitHubRelease = await response.json();
        setLatestRelease(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
        console.error('Failed to fetch latest release:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestRelease();
  }, []);

  return (
    <div className="relative isolate overflow-hidden bg-gray-900 min-h-screen">
      <svg
        aria-hidden="true"
        className="absolute inset-0 -z-10 size-full mask-[radial-gradient(100%_100%_at_top_right,white,transparent)] stroke-white/10"
      >
        <defs>
          <pattern
            x="50%"
            y={-1}
            id="983e3e4c-de6d-4c3f-8d64-b9761d1534cc"
            width={200}
            height={200}
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 200V.5H200" fill="none" />
          </pattern>
        </defs>
        <svg x="50%" y={-1} className="overflow-visible fill-gray-800/20">
          <path
            d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
            strokeWidth={0}
          />
        </svg>
        <rect fill="url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)" width="100%" height="100%" strokeWidth={0} />
      </svg>
      <div
        aria-hidden="true"
        className="absolute top-10 left-[calc(50%-4rem)] -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:top-[calc(50%-30rem)] lg:left-48 xl:left-[calc(50%-24rem)]"
      >
        <div
          style={{
            clipPath:
              'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
          }}
          className="aspect-1108/632 w-277 bg-linear-to-r from-[#80caff] to-[#4f46e5] opacity-20"
        />
      </div>
      <div className="mx-auto max-w-7xl px-6 pt-10 pb-24 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl shrink-0 lg:mx-0 lg:pt-8">
          <img
            alt="Your Company"
            src={logoNk}
            className="h-32"
          />
          <GithubTag latestRelease={latestRelease} loading={loading} error={error} />

          <h1 className="mt-10 text-5xl font-semibold tracking-tight text-pretty text-white sm:text-7xl">
            Nippon Kempo Tournament
          </h1>
          <p className="mt-8 text-lg font-medium text-pretty text-gray-400 sm:text-xl/8">
            Découvrez la nouvelle application de gestion de tournois de Nippon Kempo
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <GithubDownloadButton owner='zen-browser' repo='desktop' client={client} latestRelease={latestRelease} loading={loading} error={error} />
          </div>
        </div>
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:mt-0 lg:mr-0 lg:ml-10 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <img
              alt="App screenshot"
              src={screen}
              width={2432}
              height={1442}
              className="w-304 rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
