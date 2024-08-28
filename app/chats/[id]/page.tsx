import ChatMessagesList from "@/components/chat-messages-list";
import getSession from "@/lib/session";
import { notFound } from "next/navigation";
import { getMessage, getRoom, getUserInfo, markMessageAsRead } from "./action";

//현재 채팅방 정보 가져오기

export default async function ChatRoom({ params }: { params: { id: string } }) {
  //load room info
  const room = await getRoom(params.id);
  if (!room) {
    return notFound();
  }

  //load user info
  const user = await getUserInfo();
  if (!user) {
    return notFound();
  }

  //메세지 초기값 (현재 서버에 저장되어 있던) 정하기
  const initialMessages = await getMessage(params.id);

  //동시에 안읽은 메세지는 채팅방 들어가면서 동시에 읽음으로 바꾸기
  //이 데이터는 useState에 초기값으로 들어가는 데이터
  //db작업은 다시 해줘야지
  const setReadMessages = initialMessages.map((message) => ({
    ...message,
    isRead: true,
  }));
  const session = await getSession();

  const productMaster = room.users.find((user) => user.id !== session.id!);

  //db에 실제로 isRead:true 작업해주기
  await markMessageAsRead(params.id);

  return (
    <ChatMessagesList
      chatRoomId={params.id}
      userId={session.id!}
      username={user.username}
      avatar={user.avatar!}
      initialMessages={setReadMessages}
      status={room.product.status}
      productId={room.product.id}
      productMaster={productMaster?.username!}
    />
  );
}
