import GamePlayer from "@/app/features/game/GamePlayer";

type Props = {
  params: Promise<{
    psalmNumber: string;
  }>;
};

export default async function LessonPage({
  params,
}: Props) {
  const { psalmNumber } = await params;

  return (
    <GamePlayer
      psalmNumber={Number(psalmNumber)}
    />
  );
}