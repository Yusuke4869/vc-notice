#!/bin/bash

corepack enable

git checkout .
git pull origin main

pnpm i
pnpm build
