import fs from 'fs';

export function getBackupShop()
{
    if (fs.existsSync('database'))
    {
        var list_file = fs.readdirSync('database');
        return list_file;
    }
    return [];
}

export function getBackupShopData(file: string)
{
    if (fs.existsSync('database/' + file))
    {
        var data = fs.readFileSync('database/' + file, 'utf-8');
        return JSON.parse(data);
    }
    return {};
}

export function getBackupLog()
{
    if (fs.existsSync('log'))
    {
        var list_file = fs.readdirSync('log');
        return list_file;
    }
    return [];
}

export function getBackupLogData(file: string)
{
    if (fs.existsSync('log/' + file))
    {
        var data = fs.readFileSync('log/' + file, 'utf-8');
        return JSON.parse(data);
    }
    return {};
}