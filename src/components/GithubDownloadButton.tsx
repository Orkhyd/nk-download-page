import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import type { PlatformInfo } from '@/lib/utils';
import windows from "@/assets/windows.svg";
import macos from "@/assets/macos.svg";
import linux from "@/assets/linux.svg";

// Define types for the GitHub Release and its assets
interface GitHubReleaseAsset {
  browser_download_url: string;
  name: string;
  size: number;
  content_type: string;
}

interface GitHubRelease {
  tag_name: string;
  name: string;
  html_url: string;
  published_at: string;
  assets: GitHubReleaseAsset[];
}

interface GithubDownloadButtonProps {
  owner: string;
  repo: string;
  windowsAssetSearchTerm?: string;
  macosAssetSearchTerm?: string;
  linuxAssetSearchTerm?: string;
  client: PlatformInfo;
  latestRelease: GitHubRelease | null;
  loading: boolean;
  error: string | null;
}

const GithubDownloadButton: React.FC<GithubDownloadButtonProps> = ({
  owner,
  repo,
  windowsAssetSearchTerm = '.installer.exe',
  macosAssetSearchTerm = '.dmg',
  linuxAssetSearchTerm = '.AppImage',
  client,
  latestRelease,
  loading,
  error,
}) => {
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!latestRelease) {
      setDownloadUrl(null);
      return;
    }

    let searchTerm = '';
    switch (client.os) {
      case 'windows':
        searchTerm = windowsAssetSearchTerm;
        break;
      case 'macos':
        searchTerm = macosAssetSearchTerm;
        break;
      case 'linux':
        searchTerm = linuxAssetSearchTerm;
        break;
      default:
        searchTerm = windowsAssetSearchTerm; // Default to Windows
    }

    // Find the appropriate asset for the current platform
    const platformAsset = latestRelease.assets.find((asset) =>
      asset.name.includes(searchTerm)
    );

    if (platformAsset) {
      setDownloadUrl(platformAsset.browser_download_url);
    } else {
      console.warn(
        `No ${client.os} asset found for ${owner}/${repo} with search term "${searchTerm}".`
      );
      setDownloadUrl(null);
    }
  }, [latestRelease, client.os, windowsAssetSearchTerm, macosAssetSearchTerm, linuxAssetSearchTerm, owner, repo]);

  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, '_blank');
    }
  };

  const getOSIcon = () => {
    switch (client.os) {
      case 'windows':
        return windows;
      case 'linux':
        return linux;
      case 'macos':
        return macos;
      default:
        return windows;
    }
  };

  const getOSDisplayName = () => {
    if (!client.os) return 'Windows';
    return client.os.charAt(0).toUpperCase() + client.os.slice(1);
  };

  if (loading) {
    return (
      <Button
        disabled
        className='rounded-2xl w-full bg-indigo-500/10 px-16 py-12 text-xl/6 font-semibold text-indigo-400 ring-1 ring-indigo-500/20 ring-inset'
      >
        <img className='w-12 shadow-2xl mr-6' src={getOSIcon()} />
        Chargement...
      </Button>
    );
  }

  if (error) {
    return (
      <Button
        disabled
        className='rounded-2xl w-full bg-red-500/10 px-16 py-12 text-xl/6 font-semibold text-red-400 ring-1 ring-red-500/20 ring-inset'
      >
        <img className='w-12 shadow-2xl mr-6' src={getOSIcon()} />
        Erreur de chargement
      </Button>
    );
  }

  if (!latestRelease || !downloadUrl) {
    return (
      <Button
        disabled
        className='rounded-2xl w-full bg-gray-500/10 px-16 py-12 text-xl/6 font-semibold text-gray-400 ring-1 ring-gray-500/20 ring-inset'
      >
        <img className='w-12 shadow-2xl mr-6' src={getOSIcon()} />
        Aucune version disponible
      </Button>
    );
  }

  return (
    <Button
      onClick={handleDownload}
      className='rounded-2xl w-full bg-indigo-500/10 px-16 py-12 text-xl/6 font-semibold text-indigo-400 ring-1 ring-indigo-500/20 ring-inset hover:bg-indigo-500/20 transition-colors'
    >
      <img className='w-12 shadow-2xl mr-6' src={getOSIcon()} />
      {`Télécharger la dernière version pour ${getOSDisplayName()}`}
    </Button>
  );
};

export default GithubDownloadButton;