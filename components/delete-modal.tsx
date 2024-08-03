import { deleteProduct } from "@/app/products/[id]/actions";
import { useFormState } from "react-dom";

interface DeleteModalProps {
  cancelHandler: () => void;
  isDeleteOpen: boolean;
  id: number;
  deleteProduct?: any;
  isOwner: boolean;
}

export default function DeleteModal({
  cancelHandler,
  isDeleteOpen,
  id,
  isOwner,
}: DeleteModalProps) {
  const handleBackgroundClick = (event: any) => {
    // 이벤트가 모달 내부에서 발생하지 않았을 때만 모달을 닫음
    if (event.target === event.currentTarget) {
      cancelHandler();
    }
  };

  // const handleDelete = async (event: React.FormEvent) => {
  //   try {
  //     await deleteProduct(id, isOwner);
  //     cancelHandler(); // 성공적으로 삭제되었을 때 모달을 닫음
  //     // 페이지를 재검증(revalidate)하거나 필요한 후속 작업을 수행합니다.
  //   } catch (error) {
  //     console.error("An error occurred:", error);
  //   }
  // };

  const [state, action] = useFormState(deleteProduct, null);

  return (
    <>
      <div
        onClick={handleBackgroundClick}
        className={`fixed inset-0 flex items-center justify-center bg-black z-50 transition-all duration-300 ${
          isDeleteOpen ? "bg-opacity-50" : "bg-opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-neutral-800 p-6 rounded-md shadow-md">
          <div className="text-white mb-4">정말 삭제할까요?</div>
          <div className="mb-4">
            <p>채팅이 있는 게시글을 삭제하면 거래</p>
            <p>상대방이 당활할 수 있어요</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={cancelHandler}
              className="flex-1 px-4 py-2 bg-neutral-500 rounded hover:bg-neutral-600 transition-colors"
            >
              취소
            </button>
            <form
              action={action}
              className="flex justify-center flex-1 px-4 py-2 rounded bg-orange-500 hover:bg-orange-600 transition-colors"
            >
              <button type="submit" id="id" name="id" value={id}>
                삭제
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
