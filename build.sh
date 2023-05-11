#!/usr/bin/env bash

SHOW_HELP=0
NPM_WATCH=0
RUN_SERVER=0
RUN_ELECTRON=0

while [ -n "$*" ]; do
	case $1 in
    	-h)
            # Show help
			SHOW_HELP=1
			;;

    	-w)
            # Use "npm run watch" instead of "npm run build", to enable hot swapping
			NPM_WATCH=1
			;;

	-s)
            # Run server after building
			RUN_SERVER=1
			;;

	-e)
            # Run electron after building
			RUN_ELECTRON=1
			;;
	esac
    shift
done

if [ "${SHOW_HELP}" -eq 1 ]; then
    echo
    echo "Usage:"
    echo "build.sh [-h] [-w] [-s] [-e]"
    echo
    echo "-h: show help"
    echo "-w: use 'npm run watch' instead of 'npm run build', to enable hot swapping"
    echo "-s: run UI server after completing the build"
    echo "-e: run electron server after completing the build"
    echo
    exit
fi

WATCH_PID=$(cat "watch.pid" || echo "")
if [ ! -z "${WATCH_PID}" ]; then
    echo "Stopping existing watch process..."
    kill "${WATCH_PID}"
    rm -f "watch.pid"
fi

if [ "${NPM_WATCH}" -eq 1 ]; then
    echo "Building qortal-ui in watch mode..."
    npm run watch &
    echo "$!" > "watch.pid";
else
    npm run build
fi

if [ "${RUN_SERVER}" -eq 1 ]; then
    echo "Running UI server..."
    trap : INT
    npm run server
elif [ "${RUN_ELECTRON}" -eq 1 ]; then
    echo "Starting electron..."
    trap : INT
    npm run start-electron
fi

WATCH_PID=$(cat "watch.pid" || echo "")
if [ ! -z "${WATCH_PID}" ]; then
    echo "Stopping watch process..."
    kill "${WATCH_PID}"
    rm -f "watch.pid"
fi

# Catch-all to kill any remaining processes
pkill -P $$
