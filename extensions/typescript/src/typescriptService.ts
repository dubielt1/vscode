/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import { CancellationToken, Uri } from 'vscode';
import * as Proto from './protocol';
import * as ProtoAdd from './protocolAdditions';
import * as semver from 'semver';

export interface ITypescriptServiceClientHost {
	syntaxDiagnosticsReceived(event: Proto.DiagnosticEvent): void;
	semanticDiagnosticsReceived(event: Proto.DiagnosticEvent): void;
	configFileDiagnosticsReceived(event: Proto.ConfigFileDiagnosticEvent): void;
	populateService(): void;
}

export class API {

	private version: string;

	constructor(version: string) {
		this.version = semver.valid(version);
		if (!this.version) {
			this.version = '1.0.0';
		} else {
			// Cut of any prerelease tag since we sometimes consume those
			// on purpose.
			let index = version.indexOf('-');
			if (index >= 0) {
				this.version = this.version.substr(0, index);
			}
		}
	}

	public has1xFeatures(): boolean {
		return semver.gte(this.version, '1.0.0');
	}

	public has203Features(): boolean {
		return semver.gte(this.version, '2.0.3');
	}

	public has206Features(): boolean {
		return semver.gte(this.version, '2.0.6');
	}
}

export interface ITypescriptServiceClient {
	asAbsolutePath(resource: Uri): string;
	asUrl(filepath: string): Uri;

	info(message: string, data?: any): void;
	warn(message: string, data?: any): void;
	error(message: string, data?: any): void;

	logTelemetry(eventName: string, properties?: { [prop: string]: string });

	experimentalAutoBuild: boolean;
	apiVersion: API;

	execute(command: 'configure', args: Proto.ConfigureRequestArguments, token?: CancellationToken): Promise<Proto.ConfigureResponse>;
	execute(command: 'open', args: Proto.OpenRequestArgs, expectedResult: boolean, token?: CancellationToken): Promise<any>;
	execute(command: 'close', args: Proto.FileRequestArgs, expectedResult: boolean, token?: CancellationToken): Promise<any>;
	execute(command: 'change', args: Proto.ChangeRequestArgs, expectedResult: boolean, token?: CancellationToken): Promise<any>;
	execute(command: 'geterr', args: Proto.GeterrRequestArgs, expectedResult: boolean, token?: CancellationToken): Promise<any>;
	execute(command: 'quickinfo', args: Proto.FileLocationRequestArgs, token?: CancellationToken): Promise<Proto.QuickInfoResponse>;
	execute(command: 'completions', args: Proto.CompletionsRequestArgs, token?: CancellationToken): Promise<Proto.CompletionsResponse>;
	execute(commant: 'completionEntryDetails', args: Proto.CompletionDetailsRequestArgs, token?: CancellationToken): Promise<Proto.CompletionDetailsResponse>;
	execute(commant: 'signatureHelp', args: Proto.SignatureHelpRequestArgs, token?: CancellationToken): Promise<Proto.SignatureHelpResponse>;
	execute(command: 'definition', args: Proto.FileLocationRequestArgs, token?: CancellationToken): Promise<Proto.DefinitionResponse>;
	execute(command: 'references', args: Proto.FileLocationRequestArgs, token?: CancellationToken): Promise<Proto.ReferencesResponse>;
	execute(command: 'navto', args: Proto.NavtoRequestArgs, token?: CancellationToken): Promise<Proto.NavtoResponse>;
	execute(command: 'navbar', args: Proto.FileRequestArgs, token?: CancellationToken): Promise<Proto.NavBarResponse>;
	execute(command: 'format', args: Proto.FormatRequestArgs, token?: CancellationToken): Promise<Proto.FormatResponse>;
	execute(command: 'formatonkey', args: Proto.FormatOnKeyRequestArgs, token?: CancellationToken): Promise<Proto.FormatResponse>;
	execute(command: 'rename', args: Proto.RenameRequestArgs, token?: CancellationToken): Promise<Proto.RenameResponse>;
	execute(command: 'occurrences', args: Proto.FileLocationRequestArgs, token?: CancellationToken): Promise<Proto.OccurrencesResponse>;
	execute(command: 'projectInfo', args: Proto.ProjectInfoRequestArgs, token?: CancellationToken): Promise<Proto.ProjectInfoResponse>;
	execute(command: 'reloadProjects', args: any, expectedResult: boolean, token?: CancellationToken): Promise<any>;
	execute(command: 'reload', args: Proto.ReloadRequestArgs, expectedResult: boolean, token?: CancellationToken): Promise<any>;
	execute(command: 'compilerOptionsForInferredProjects', args: ProtoAdd.SetCompilerOptionsForInferredProjectsArgs, token?: CancellationToken): Promise<any>;
	execute(command: 'navtree', args: Proto.FileRequestArgs, token?: CancellationToken): Promise<ProtoAdd.NavTreeResponse>;
	// execute(command: 'compileOnSaveAffectedFileList', args: Proto.CompileOnSaveEmitFileRequestArgs, token?: CancellationToken): Promise<Proto.CompileOnSaveAffectedFileListResponse>;
	// execute(command: 'compileOnSaveEmitFile', args: Proto.CompileOnSaveEmitFileRequestArgs, token?: CancellationToken): Promise<any>;
	execute(command: string, args: any, expectedResult: boolean | CancellationToken, token?: CancellationToken): Promise<any>;
}