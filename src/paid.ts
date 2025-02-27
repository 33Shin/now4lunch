import fs from 'fs';

export function setPaidData(ip: string, date: string)
{
    var paid = getPaidData(date);
    paid.push(ip);
    fs.mkdirSync(`log/${date}/paid`, { recursive: true });
    fs.writeFileSync(`log/${date}/paid/paid.dat`, JSON.stringify(paid))
}

export function getPaidData(date: string | undefined)
{
    if (date == null)
    {
        date = new Date().toISOString().split('T')[0];
    }
    if (fs.existsSync(`log/${date}/paid/paid.dat`))
    {
        return JSON.parse(fs.readFileSync(`log/${date}/paid/paid.dat`, 'utf-8'));;
    }
    return [];
}