corepack enable

if [ ! -d ./dist ]; then
  git checkout .
  git pull origin main

  pnpm i
  pnpm build
fi

pnpm start-vc-notice &

PID_FILE=./vc-notice.pid
pid=$!
echo $pid >${PID_FILE}
exit 0
