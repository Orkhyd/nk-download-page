import React from 'react';

interface GitHubRelease {
  tag_name: string;
  name: string;
  html_url: string;
  published_at: string;
}

interface GithubTagProps {
  latestRelease: GitHubRelease | null;
  loading: boolean;
  error: string | null;
}

const GithubTag: React.FC<GithubTagProps> = ({
  latestRelease,
  loading,
  error,
}) => {
  if (loading) {
    return <p>Loading latest release...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  if (!latestRelease) {
    return <p>No release data available.</p>;
  }

  return (
    <div className="mt-24 sm:mt-32 lg:mt-16">
      <a href={latestRelease.html_url} className="inline-flex space-x-6">
        <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-sm/6 font-semibold text-indigo-400 ring-1 ring-indigo-500/20 ring-inset">
          {`Version ${latestRelease.tag_name}`}
        </span>
      </a>
    </div>
  )
};

export default GithubTag;