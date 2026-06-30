export const BUFFERED_CHONK_IMAGES: Record<string, string> = {
  "585": "/chonks/chonk-585.svg",
  "586": "/chonks/chonk-586.svg",
  "588": "/chonks/chonk-588.svg",
  "596": "/chonks/chonk-596.svg",
  "599": "/chonks/chonk-599.svg",
  "601": "/chonks/chonk-601.svg",
  "606": "/chonks/chonk-606.svg",
  "662": "/chonks/chonk-662.svg",
  "663": "/chonks/chonk-663.svg",
  "665": "/chonks/chonk-665.svg",
  "672": "/chonks/chonk-672.svg",
  "676": "/chonks/chonk-676.svg",
  "678": "/chonks/chonk-678.svg",
  "680": "/chonks/chonk-680.svg",
  "681": "/chonks/chonk-681.svg",
  "693": "/chonks/chonk-693.svg",
  "697": "/chonks/chonk-697.svg",
  "700": "/chonks/chonk-700.svg",
  "972": "/chonks/chonk-972.svg",
  "9534": "/chonks/chonk-9534.svg",
};

export const getBufferedChonkImage = (tokenId: string | number) =>
  BUFFERED_CHONK_IMAGES[String(tokenId)];