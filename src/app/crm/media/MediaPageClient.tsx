"use client";

import MediaBrowser from "./MediaBrowser";

/**
 * Standalone media library page.
 *
 * `-m-8` cancels the `p-8` the CRM layout puts on <main> so the browser
 * fills the column edge-to-edge. `h-full` works because the parent
 * <main> is itself exactly viewport-tall (the layout switched outer to
 * `h-screen overflow-hidden` so each page is fully sized).
 */
export default function MediaPageClient() {
  return (
    <div className="flex flex-col h-full -m-8 bg-white">
      <div className="px-6 pt-6 pb-4 border-b border-gray-200 shrink-0">
        <h1 className="text-2xl font-bold text-gray-900">Media</h1>
        <p className="text-sm text-gray-500">
          Upload and manage images and videos used across the site.
        </p>
      </div>
      <div className="flex-1 min-h-0">
        <MediaBrowser mode="manage" />
      </div>
    </div>
  );
}
