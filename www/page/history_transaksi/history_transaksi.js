function penjualan_row(id_penjualan, kode_transaksi, tanggal, nama_outlet, atas_nama, whatsapp, total_transaksi_bersih, status_bayar) {
    var self = this;
    self.id_penjualan = ko.observable(id_penjualan);
    self.kode_transaksi = ko.observable(kode_transaksi);
    self.tanggal = ko.observable(tanggal);
    self.nama_outlet = ko.observable(nama_outlet);
    self.atas_nama = ko.observable(atas_nama);
    self.whatsapp = ko.observable(whatsapp);
    self.total_transaksi_bersih = ko.observable(total_transaksi_bersih);
    self.total_transaksi_bersih_nominal = ko.computed(function () {

        var str = float_to_currency(self.total_transaksi_bersih());

        return str;

    })
    self.status_bayar = ko.observable(status_bayar);

    self.detail_click = function () {
        var id_penjualan = self.id_penjualan();
        localStorage.setItem('id_penjualan', id_penjualan);

        $.get('page/history_transaksi/detail.html', function (data) {
            $('#content').html(data);
        });

    }
}


function History_transaksi_model() {
    var self = this;

    self.f_kode_transaksi = ko.observable('');
    self.f_nama_outlet = ko.observable('');
    self.f_atas_nama = ko.observable('');
    self.f_whatsapp = ko.observable('');

    self.history_transaksi_list = ko.observableArray([]);

    self.start = ko.observable(0);
    self.limit = ko.observable(5);
    self.g_filter = ko.observable('');

    self.scroll_bottom = function () {
        var start = self.start();
        var limit = self.limit();

        start = start + limit;

        self.start(start);
        self.limit(limit);

        self.get_history_transaksi_list();
    }

    self.f_clear_g_filter = function () {
        self.g_filter('');
        self.start(0);

        self.history_transaksi_list([]);
        self.get_history_transaksi_list();
    }

    self.f_pencarian = function () {
        self.start(0);
        self.history_transaksi_list([]);
        self.get_history_transaksi_list();
    }

    self.get_history_transaksi_list = function () {
        var url = localStorage.getItem('hostname') + '/penjualan/penjualan/get_list';
        var token = localStorage.getItem('token');
        var start = self.start();
        var limit = self.limit();
        var g_filter = self.g_filter();

        $.ajax({
            url: url,
            type: 'post',
            crossDomain: true,
            data: {
                'token': token,
                'start': start,
                'limit': limit,
                'g_filter': g_filter,
            },
            success: function (result) {
                if (result.status) {
                    data = result.data;

                    if (result.data.length < 1) {
                        var start2 = start - limit;
                        self.start(start2);
                    }

                    for (var i = 0; i < data.length; i++) {
                        row = data[i];
                        var push = new penjualan_row(row.id_penjualan, row.kode_transaksi, row.tanggal, row.nama_outlet, row.atas_nama, row.whatsapp, row.total_transaksi_bersih, row.status_bayar);
                        self.history_transaksi_list.push(push);
                    }
                }
            }
        });
    }

    self.history_list_add = function (element, index, data) {
        if (element.nodeType === 1) {
            $(element).css('opacity', 0);
            var interval = (($(element).index() + 1) * 100);

            setTimeout(function () {
                $(element).animate({opacity: 1});
            }, interval);
        }

    };

    self.get_history_transaksi_list();
}


$('#history_transaksi').ready(function () {
    ko.applyBindings(new History_transaksi_model(), document.getElementById("history_transaksi"));


    $('#pagination-detect').on('inview', function (event, isInView) {
        if (isInView) {
            var context = ko.contextFor(document.getElementById("history_transaksi"));
            context.$data.scroll_bottom();
        } else {
            // element has gone out of viewport
        }
    });

});