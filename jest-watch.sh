#!/bin/bash
export WATCHMAN_DISABLE=true
export CI=false
jest --watch --no-coverage --detectOpenHandles
