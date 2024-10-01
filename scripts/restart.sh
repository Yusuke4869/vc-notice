PATH=$PATH:$HOME/.volta/bin

git checkout .
git pull origin main

pnpm i
pnpm build

for PID in $(ps -e -o pid,cmd | grep pnpm | grep start-vc-notice | awk '{print $1}'); do
  kill $PID
done

pnpm start-vc-notice
