PATH=$PATH:$HOME/.volta/bin

if [ ! -d ./dist ]; then
  git checkout .
  git pull origin main

  pnpm i
  pnpm build
fi

pnpm start-vc-notice