/** biome-ignore-all lint/a11y/useValidAnchor: <> */
export default function LegalLinks() {
  return (
    <div className="mt-auto flex flex-wrap items-center gap-2 gap-y-1 [&>a]:text-secondary [&>a]:text-xs [&>a]:hover:underline">
      <a href="#">Quibble Rules</a>
      <a href="#">Privacy Policy</a>
      <a href="#">User Agreement</a>
      <a href="#">
        Quibble &copy; {new Date().getFullYear()}. All rights reserved.
      </a>
    </div>
  );
}
