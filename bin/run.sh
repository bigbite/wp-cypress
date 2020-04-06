#!/bin/bash

CYAN=$(tput setaf 3)
GREEN=$(tput setaf 2)
RED=$(tput setaf 1)
NORMAL=$(tput sgr0)

_spinner() {
  local icons=(
    $(echo -e '\xe2\x97\x90')
    $(echo -e '\xe2\x97\x91')
    $(echo -e '\xe2\x97\x92')
    $(echo -e '\xe2\x97\x93')
  )

  tput civis
  tput sc
  printf "%s %s" "${icons[0]}" "$1"
  tput el
  tput rc

  local i=1
  while :; do
    printf "%s" "${CYAN}${icons[i]}${NORMAL}"
    i=$(($i+1))
    i=$(($i%4))
    sleep 0.1
    printf "\b\b\b"
  done
}

function spinner {
  _spinner "${1}" &
  _sp_pid=$!
  disown
}

function stop_spinner {
  printf "\b\b\b"
  tput el

  kill -9 $_sp_pid 2> /dev/null
  unset _sp_pid

  printf "%s\n" "$(echo -e $1) $2"
  tput cnorm
}

function stop_spinner_success {
  stop_spinner "${GREEN}Success:${NORMAL}" "$1"
}

function stop_spinner_error {
  stop_spinner " ${RED}Error:${NORMAL}" "$1"

  echo "See logfile for more info: $LOGFILE"

  exit
}

run() {
  spinner "$2"

  if "$1" 1>>${LOGFILE} 2>&1 ; then
    stop_spinner_success "$3"
  else
    stop_spinner_error "$4"
  fi
}

