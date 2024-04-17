import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.addConsoleLog', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selectedText = editor.document.getText(editor.selection);
            if (selectedText) {
                const selectedLine = editor.selection.active.line;
                const selectedLineText = editor.document.lineAt(selectedLine).text;
                const leadingWhitespace = selectedLineText.match(/^\s*/)?.[0] || ''; // Extract leading whitespace
                const selectedLineEnd = editor.document.lineAt(selectedLine).range.end;

                // Check if the selected line ends with a newline character
                const selectedLineEndsWithNewline = selectedLineText.endsWith('\n');
                // If not, add a newline character before the console.log statement
                const newLine = selectedLineEndsWithNewline ? '' : '\n';

                const logStatement = `${newLine}${leadingWhitespace}console.log(${selectedText});`;
                editor.edit((editBuilder) => {
                    editBuilder.insert(selectedLineEnd, logStatement);
                });

                // Show notification
                vscode.window.withProgress({
                    location: vscode.ProgressLocation.Notification,
                    title: 'QuickPaste Extension'
                }, async (progress) => {
                    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds
                });
            } else {
                vscode.window.showInformationMessage('No text selected.');
            }
        } else {
            vscode.window.showInformationMessage('No active editor.');
        }
    });

    context.subscriptions.push(disposable);
}
