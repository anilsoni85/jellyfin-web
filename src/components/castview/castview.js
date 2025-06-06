import dialogHelper from '../dialogHelper/dialogHelper';
import loading from '../loading/loading';
import globalize from '../../lib/globalize';
import layoutManager from '../layoutManager';
import ServerConnections from '../ServerConnections';
import template from './castview.template.html';

export function show(itemId, serverId) {
    loading.show();

    const apiClient = ServerConnections.getApiClient(serverId);

    apiClient.getItem(apiClient.getCurrentUserId(), itemId).then(item => {
        const dialogOptions = {
            size: 'medium',
            removeOnClose: true,
            scrollY: false
        };

        if (layoutManager.tv) {
            dialogOptions.size = 'fullscreen';
        }

        const dlg = dialogHelper.createDialog(dialogOptions);

        dlg.classList.add('formDialog');
        dlg.classList.add('recordingDialog');

        let html = '';
        html += globalize.translateHtml(template, 'core');

        dlg.innerHTML = html;

        // Has to be assigned a z-index after the call to .open()
        dlg.addEventListener('close', onDialogClosed);

        dlg.querySelector('.btnClose').addEventListener('click', () => {
            dialogHelper.close(dlg);
        });

        dialogHelper.open(dlg);

        const people = item.People;
        if (!people?.length) {
            console.log('showCast - people is undefined or empty.', people);
            dlg.querySelector('#castContent').classList.add('hide');
        } else {
            console.debug('showCast - Rendering people.', people);
            dlg.querySelector('#castContent').classList.remove('hide');
            const castContent = dlg.querySelector('#castContent');

            import('../cardbuilder/peoplecardbuilder').then(({ default: peoplecardbuilder }) => {
                peoplecardbuilder.buildPeopleCards(people, {
                    itemsContainer: castContent,
                    coverImage: true,
                    serverId: item.ServerId,
                    shape: 'overflowPortrait',
                    imageBlurhashes: item.ImageBlurHashes
                });
            });
        }

        loading.hide();
    });
}

function onDialogClosed() {
    loading.hide();
}

