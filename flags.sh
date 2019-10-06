cd express

echo -n "Enter the server port [3000]: "
read port
if [ -z $port ]; then port="3000"; fi

sqlite3 database.db "SELECT posts.id, Users.username, Flags.flagType, Resources.filename, Users.id FROM Posts, Flags, Users, Resources WHERE Posts.id = Flags.postId AND Users.id = Flags.userId AND Resources.id = Posts.image" |\
while read row; do
    postId=$(echo $row | cut -d'|' -f1)
    userId=$(echo $row | cut -d'|' -f5)
    
    case $(echo $row | cut -d'|' -f3) in
        0) reason="Contains Text";;
        1) reason="Contains Unfortunate Content";;
        2) reason="Undefined (???)";;
    esac
    
    echo
    echo
    echo "---New Flag---"
    echo "Post ID: $postId"
    echo "Resource: $(echo $row | cut -d'|' -f4)"
    echo "Reporting User: $(echo $row | cut -d'|' -f2) ($userId)"
    echo "Reason: $reason"
    echo
    
    options=("Skip" "Remove Post" "Remove Flag" "Exit")
    PS3="What do you want to do now? "
    select option in "${options[@]}"; do
        case $REPLY in
            1) break;;
            2) curl -X DELETE -H "Authorization: Application ADMINFLAG" "http://[::1]:$port/api/posts/$postId"; break;;
            3) sqlite3 database.db "DELETE FROM Flags WHERE userId = $userId AND postId = $postId"; break;;
            4) exit 0;;
            *) ;;
            esac
    done < /dev/tty
done
