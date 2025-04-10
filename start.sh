#!/bin/bash
set -e

yarn
yarn prisma generate
yarn start:dev
