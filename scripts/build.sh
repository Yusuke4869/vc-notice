PATH=$PATH:$HOME/.volta/bin

git checkout .
git pull origin main

pnpm i
pnpm build
