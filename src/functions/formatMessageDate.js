export default function formatMessageDate(isoString){
    const date = new Date(isoString);
    const now = new Date();

    const isSameDay = date.toDateString() === now.toDateString();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    const isYesterday = date.toDateString() === yesterday.toDateString();
    
    if(isSameDay){
        return date.toLocaleTimeString(undefined,{
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    if(isYesterday){
        return `Yesterday at ${date.toLocaleTimeString(undefined,{
            hour: '2-digit',
            minute: '2-digit'
        })}`;
    }

    return date.toLocaleString(undefined,{
        dateStyle: "medium",
        timeStyle: "short"
    });
}