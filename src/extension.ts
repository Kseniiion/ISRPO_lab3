import * as vscode from 'vscode'; 
import * as fs from 'fs/promises';  
import * as path from 'path'; 

export function activate(context: vscode.ExtensionContext) { 
    let disposable = vscode.commands.registerCommand('extension.removeComments', async () => { 
        const editor = vscode.window.activeTextEditor; 
        if (!editor) { 
            return;  
        } 

        const document = editor.document; 
        const filePath = document.fileName; 

        if (!filePath.endsWith('.cpp') && !filePath.endsWith('.h')) { 
            vscode.window.showErrorMessage('Неверный тип файла'); 
            return; 
        } 

        const fileName = path.basename(filePath, path.extname(filePath));
        const fileDir = path.dirname(filePath);
        const copyFilePath = path.join(fileDir, `${fileName}_copy${path.extname(filePath)}`); 
        const text = document.getText(); 
        const cleanedText = text.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, '');

        try {
            const tmp = document.fileName;
            await fs.rename(filePath, copyFilePath);
            await fs.writeFile(tmp, cleanedText); 
            vscode.window.showInformationMessage(`Файл ${path.basename(copyFilePath)} создан`); 

        } catch (err) { 
            vscode.window.showErrorMessage('Ошибка при создании файла: ' + String(err)); 
        } 
    }); 

    context.subscriptions.push(disposable); 
} 

export function deactivate() {}
