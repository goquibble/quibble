import Image from "next/image";

export default function Loading() {
  return (
    <div className="relative mx-auto grid w-max place-items-center">
      <span className="-z-1 absolute aspect-square w-1/2 animate-ping rounded-full bg-primary"></span>
      <Image src="/favicon.svg" alt="Loading..." width={50} height={50} />
    </div>
  );
}
