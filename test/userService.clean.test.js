const { UserService } = require('../src/userService');

const dadosUsuarioPadrao = {
  nome: 'Fulano de Tal',
  email: 'fulano@teste.com',
  idade: 25,
};

describe('UserService - Suíte de Testes Refatorada', () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
    userService._clearDB();
  });

  describe('createUser', () => {
    test('deve criar um usuário com dados válidos e retornar objeto com id definido', () => {
      // Arrange
      const nome = dadosUsuarioPadrao.nome;
      const email = dadosUsuarioPadrao.email;
      const idade = dadosUsuarioPadrao.idade;

      // Act
      const usuarioCriado = userService.createUser(nome, email, idade);

      // Assert
      expect(usuarioCriado).toBeDefined();
      expect(usuarioCriado.id).toBeDefined();
      expect(typeof usuarioCriado.id).toBe('string');
    });

    test('deve criar um usuário com todas as propriedades corretas', () => {
      // Arrange
      const nome = dadosUsuarioPadrao.nome;
      const email = dadosUsuarioPadrao.email;
      const idade = dadosUsuarioPadrao.idade;

      // Act
      const usuarioCriado = userService.createUser(nome, email, idade);

      // Assert
      expect(usuarioCriado.nome).toBe(nome);
      expect(usuarioCriado.email).toBe(email);
      expect(usuarioCriado.idade).toBe(idade);
      expect(usuarioCriado.status).toBe('ativo');
      expect(usuarioCriado.isAdmin).toBe(false);
      expect(usuarioCriado.createdAt).toBeInstanceOf(Date);
    });

    test('deve lançar erro ao criar usuário menor de idade', () => {
      // Arrange
      const nome = 'Menor';
      const email = 'menor@email.com';
      const idade = 17;

      // Act & Assert
      expect(() => {
        userService.createUser(nome, email, idade);
      }).toThrow('O usuário deve ser maior de idade.');
    });

    test('deve lançar erro ao criar usuário sem nome', () => {
      // Arrange
      const nome = null;
      const email = dadosUsuarioPadrao.email;
      const idade = dadosUsuarioPadrao.idade;

      // Act & Assert
      expect(() => {
        userService.createUser(nome, email, idade);
      }).toThrow('Nome, email e idade são obrigatórios.');
    });

    test('deve criar usuário administrador quando isAdmin for true', () => {
      // Arrange
      const nome = 'Admin';
      const email = 'admin@teste.com';
      const idade = 30;
      const isAdmin = true;

      // Act
      const usuarioCriado = userService.createUser(nome, email, idade, isAdmin);

      // Assert
      expect(usuarioCriado.isAdmin).toBe(true);
    });
  });

  describe('getUserById', () => {
    test('deve buscar um usuário existente pelo id', () => {
      // Arrange
      const usuarioCriado = userService.createUser(
        dadosUsuarioPadrao.nome,
        dadosUsuarioPadrao.email,
        dadosUsuarioPadrao.idade
      );

      // Act
      const usuarioBuscado = userService.getUserById(usuarioCriado.id);

      // Assert
      expect(usuarioBuscado).toBeDefined();
      expect(usuarioBuscado.id).toBe(usuarioCriado.id);
      expect(usuarioBuscado.nome).toBe(dadosUsuarioPadrao.nome);
      expect(usuarioBuscado.status).toBe('ativo');
    });

    test('deve retornar null ao buscar usuário inexistente', () => {
      // Arrange
      const idInexistente = 'id_que_nao_existe';

      // Act
      const usuarioBuscado = userService.getUserById(idInexistente);

      // Assert
      expect(usuarioBuscado).toBeNull();
    });
  });

  describe('deactivateUser', () => {
    test('deve desativar usuário comum e retornar true', () => {
      // Arrange
      const usuarioComum = userService.createUser('Comum', 'comum@teste.com', 30);

      // Act
      const resultado = userService.deactivateUser(usuarioComum.id);

      // Assert
      expect(resultado).toBe(true);
      const usuarioAtualizado = userService.getUserById(usuarioComum.id);
      expect(usuarioAtualizado.status).toBe('inativo');
    });

    test('deve retornar false ao tentar desativar usuário administrador', () => {
      // Arrange
      const usuarioAdmin = userService.createUser('Admin', 'admin@teste.com', 40, true);

      // Act
      const resultado = userService.deactivateUser(usuarioAdmin.id);

      // Assert
      expect(resultado).toBe(false);
      const usuarioVerificado = userService.getUserById(usuarioAdmin.id);
      expect(usuarioVerificado.status).toBe('ativo');
    });

    test('deve retornar false ao tentar desativar usuário inexistente', () => {
      // Arrange
      const idInexistente = 'id_que_nao_existe';

      // Act
      const resultado = userService.deactivateUser(idInexistente);

      // Assert
      expect(resultado).toBe(false);
    });
  });

  describe('generateUserReport', () => {
    test('deve gerar relatório com cabeçalho quando há usuários', () => {
      // Arrange
      userService.createUser('Alice', 'alice@email.com', 28);
      userService.createUser('Bob', 'bob@email.com', 32);

      // Act
      const relatorio = userService.generateUserReport();

      // Assert
      expect(relatorio).toContain('--- Relatório de Usuários ---');
    });

    test('deve incluir informações dos usuários no relatório', () => {
      // Arrange
      const usuario1 = userService.createUser('Alice', 'alice@email.com', 28);
      const usuario2 = userService.createUser('Bob', 'bob@email.com', 32);

      // Act
      const relatorio = userService.generateUserReport();

      // Assert
      expect(relatorio).toContain(usuario1.id);
      expect(relatorio).toContain('Alice');
      expect(relatorio).toContain('ativo');
      expect(relatorio).toContain(usuario2.id);
      expect(relatorio).toContain('Bob');
    });

    test('deve retornar mensagem apropriada quando não há usuários cadastrados', () => {
      // Arrange
      // Não criar nenhum usuário

      // Act
      const relatorio = userService.generateUserReport();

      // Assert
      expect(relatorio).toContain('--- Relatório de Usuários ---');
      expect(relatorio).toContain('Nenhum usuário cadastrado.');
    });

    test('deve incluir status dos usuários no relatório', () => {
      // Arrange
      const usuarioAtivo = userService.createUser('Ativo', 'ativo@email.com', 25);
      const usuarioComum = userService.createUser('Comum', 'comum@email.com', 30);
      userService.deactivateUser(usuarioComum.id);

      // Act
      const relatorio = userService.generateUserReport();

      // Assert
      expect(relatorio).toContain(usuarioAtivo.id);
      expect(relatorio).toContain('Ativo');
      expect(relatorio).toContain('ativo');
      expect(relatorio).toContain(usuarioComum.id);
      expect(relatorio).toContain('Comum');
      expect(relatorio).toContain('inativo');
    });
  });
});

