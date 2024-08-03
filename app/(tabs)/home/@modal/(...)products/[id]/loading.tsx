import CloseButton from "@/components/close-button";
import { PhotoIcon } from "@heroicons/react/24/solid";

export default function ModalLoading() {
  return (
    <>
      <div className="absolute w-full h-full z-50 flex justify-center items-center bg-black bg-opacity-60 left-0 top-0">
        <div className="max-w-screen-sm h-1/2 w-full flex justify-center">
          <CloseButton />
          <div className="aspect-square bg-neutral-700 text-neutral-200 rounded-md flex justify-center items-center">
            <PhotoIcon className="h-28" />
          </div>
        </div>
      </div>
    </>
  );
}
