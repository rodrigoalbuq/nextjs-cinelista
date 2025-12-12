$env:WATCHMAN_DISABLE = "true"
$env:CI = "false"
npm test -- --no-coverage --detectOpenHandles --forceExit
