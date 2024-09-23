PATH=$PATH:$HOME/.volta/bin

git checkout .
git pull origin main

pnpm install
pnpm build

for PID in $(ps -e -o pid,cmd | grep yarn | grep start-vc-notice | awk '{print $1}'); do
  kill $PID
done

nohup pnpm start-vc-notice &
