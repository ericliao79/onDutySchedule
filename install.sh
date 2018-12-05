# echo '.'
mkdir screenshots
printf "\033[32m Do you want to install pm2 in this project? (y/N) \033[0m\n"
read option
if [ "$option" = "N" ] || [ "$option" = "n" ] || [ "$option" = "" ]
  then
    printf -- '\033[37m Passing installing of pm2 .... \033[0m\n'
    printf -- '\n'
    # exit 1
  else
    npm install pm2
fi
