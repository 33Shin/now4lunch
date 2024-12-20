import fs from "fs";

interface Identity 
{
    ip: string,
    name: string,
}

export const IDENTITY: Identity[] = JSON.parse(fs.readFileSync('database/identity.dat', 'utf-8'));

export function addIdentity(ip: string, name: string)
{
    IDENTITY.push({
        ip: ip,
        name: name
    });
}

export function backupIdentity()
{
    fs.writeFileSync('database/identity.dat', JSON.stringify(IDENTITY));
}

export function setIdentity(data: any)
{
    IDENTITY.length = 0;
    data.forEach((i: any) => {
        IDENTITY.push({
            name: i.name,
            ip: i.ip
        });
    });
    backupIdentity();
}